#include <string>

#include "Analyzer.h"
#include "VolumeBuffer.h"
#include "BufferVolumeData.h"
#include "../RenderObject/VolumeModel.h"
#include "../Buffer/BufferMeshData.h"

#include "Commands.h"

VolumeBuffer::VolumeBuffer(RENDER_MODE mode) : BaseBuffer(mode)
{
    m_vtx_id     = 0;
    m_normal_id  = 0;
    m_mat_id     = 0;
    m_tex_id     = 0;
    m_index_id   = 0;
    m_vertex_num = 0;
    m_index_num  = 0;
    memset(m_boxsize, 0, sizeof(m_boxsize));
    memset(m_voldim, 0, sizeof(m_voldim));
    memset(m_volMinVal, 0, sizeof(m_volMinVal));
    memset(m_volMaxVal, 0, sizeof(m_volMaxVal));
    m_volHist[0].clear();
    m_volHist[1].clear();
    m_volHist[2].clear();
    m_model      = 0;
}

VolumeBuffer::~VolumeBuffer()
{
}

bool VolumeBuffer::MakeBox(float width, float height, float depth)
{
    static float vtx[] = {
        -width*.5f, height*.5f,-depth*.5f,
        width*.5f, height*.5f,-depth*.5f,
        -width*.5f,-height*.5f,-depth*.5f,
        width*.5f,-height*.5f,-depth*.5f,
        width*.5f, height*.5f, depth*.5f,
        -width*.5f, height*.5f, depth*.5f,
        width*.5f,-height*.5f, depth*.5f,
        -width*.5f,-height*.5f, depth*.5f
    };
    static float* normal = vtx;
    static unsigned int index[] = { 0,1,2, 1,3,2,  1,4,3, 4,6,3,  4,5,6, 5,7,6,  5,0,7, 0,2,7,  5,4,0, 4,1,0,  2,3,7, 3,6,7 };
    const unsigned int vertexnum = sizeof(vtx)/sizeof(float)/3;
    const unsigned int indexnum  = sizeof(index)/sizeof(unsigned int);
    static float mat[vertexnum*3] = {0};

    CreateVBIB_SGL(vertexnum, &vtx[0], &normal[0], &mat[0], 0, indexnum, &index[0],
            m_vtx_id, m_normal_id, m_mat_id, m_tex_id, m_index_id);
    m_vertex_num = vertexnum;
    m_index_num  = indexnum;

    //CreateVBIB_GL(vertexnum, &vtx[0], &normal[0], &mat[0], 0, indexnum, &index[0],
    //        m_ogl.vtx, m_ogl.normal, m_ogl.material, m_sgl.tex, m_ogl.index);
    //m_ogl.vtxnum   = vertexnum;
    //m_ogl.indexnum = indexnum;

    m_boxsize[0] = width;
    m_boxsize[1] = height;
    m_boxsize[2] = depth;

    return true;
}

bool VolumeBuffer::CreateTexture3D(unsigned int width, unsigned int height, unsigned int depth, unsigned int component, const float* volumedata)
{
    printf("CreateTexture3D(%d,%d,%d,%d)\n", width, height, depth, component);
    GenTextures_SGL(1, &m_sgl_voltex);
    BindTexture3D_SGL(m_sgl_voltex);
    TexImage3DPointer_SGL(width, height, depth, component, volumedata);
    m_voldim[0] = width;
    m_voldim[1] = height;
    m_voldim[2] = depth;

    VolumeAnalyzerProc analyze;
    int dim[] = {static_cast<int>(width), static_cast<int>(height), static_cast<int>(depth)};
    if (component == 1) {
        analyze.AnalyzeScalar(m_volHist[0], m_volMinVal[0], m_volMaxVal[0], (const float*)volumedata, dim);
        for (int i = 1; i < 3; ++i) {
            m_volHist[i] = m_volHist[0];
            m_volMinVal[i] = m_volMinVal[0];
            m_volMaxVal[i] = m_volMaxVal[0];
        }
    } else if (component == 3) {
        analyze.AnalyzeVector(m_volHist, m_volMinVal, m_volMaxVal, (const float*)volumedata, dim);
    } else {
        analyze.AnalyzeVector(m_volHist, m_volMinVal, m_volMaxVal, (const float*)volumedata, dim, 256, component);
    }

    return true;
}

bool VolumeBuffer::Create(const VolumeModel* model)
{
    bool r = true;
    if (!model) {
        printf("Failed to create volume\n");
        return false;
    }

    //todo constant behavior.
    //m_model = reinterpret_cast<VolumeModel*>(model);
    m_model = (VolumeModel*)(model);

    // load shader
    const std::string& shadername = model->GetShader();
    printf("%s\n", shadername.c_str());
    r &= loadShaderSrc(shadername.c_str());
    if (!r) {
        printf("[Error]Not set shader\n");
        return false;
    }

    // make VolumeData
    BufferVolumeData* volume = model->GetVolume();
    if(!volume) {
        printf("[Error] BufferVolumeData is NULL\n");
        return false;
    }
    if(volume->Buffer()) {
        float sw = volume->Width();
        float sh = volume->Height();
        float sd = volume->Depth();
        r = CreateTexture3D(sw, sh, sd, volume->Component(), volume->Buffer()->GetBuffer());
        MakeBox(sw,sh,sd);
    } else {
        printf("[Error] Not load buffer\n");
    }
    return r;
}

void VolumeBuffer::Render() const
{
    if (!m_model) {
        printf("[Error] Not set volume\n");
    }

    // TODO: not supported yet rotation
    VX::Math::vec3 scale = m_model->GetScale();
    //float volumescale[] = {
    //    m_boxsize[0] * scale.x,
    //    m_boxsize[1] * scale.y,
    //    m_boxsize[2] * scale.z
    //};
    float volumescale[] = {m_boxsize[0],m_boxsize[1],m_boxsize[2]};
    printf("%f %f %f\n", volumescale[0], volumescale[1], volumescale[2]);
    
    const unsigned int prg = getProgram();
    SetUniform3fv_SGL(prg, "volumescale", volumescale);
    SetUniform3fv_SGL(prg, "volumedim", m_voldim);
    VX::Math::vec3 translate = m_model->GetTranslate();
    SetUniform3fv_SGL(prg, "offset", (float *)&translate);
    
    const RenderObject::Vec4Map& vec4array = m_model->GetUniformVec4();
    RenderObject::Vec4Map::const_iterator it4, eit4 = vec4array.end();
    for (it4 = vec4array.begin(); it4 != eit4; ++it4) {
        const VX::Math::vec4& v4 = it4->second;
        SetUniform4fv_SGL(prg, it4->first.c_str(), (const float*)&v4);
    }
    const std::map<std::string, VX::Math::vec3>& vec3array = m_model->GetUniformVec3();
    RenderObject::Vec3Map::const_iterator it3, eit3 = vec3array.end();
    for (it3 = vec3array.begin(); it3 != eit3; ++it3) {
        const VX::Math::vec4& v3 = it3->second;
        SetUniform3fv_SGL(prg, it3->first.c_str(), (const float*)&v3);
    }
    const std::map<std::string, VX::Math::vec2>& vec2array = m_model->GetUniformVec2();
    RenderObject::Vec2Map::const_iterator it2, eit2 = vec2array.end();
    for (it2 = vec2array.begin(); it2 != eit2; ++it2) {
        const VX::Math::vec4& v2 = it2->second;
        SetUniform2fv_SGL(prg, it2->first.c_str(), (const float*)&v2);
    }
    const RenderObject::FloatMap& floatarray = m_model->GetUniformFloat();
    RenderObject::FloatMap::const_iterator itf, eitf = floatarray.end();
    for (itf = floatarray.begin(); itf != eitf; ++itf) {
        const float vf = itf->second;
        SetUniform1f_SGL(prg, it2->first.c_str(), vf);
    }

    BindVBIB_SGL(getProgram(), m_vtx_id, m_normal_id, m_mat_id, m_tex_id, m_index_id);
    BindTexture3D_SGL(m_sgl_voltex);
    SetUniform1i_SGL(getProgram(), "tex0", 0);
    if (m_index_id)
    {
        DrawElements_SGL(m_index_num);
    } else {
        DrawArrays_SGL(m_vertex_num);
    }
}

