#ifndef _RENDEROBJECT_LUA_H_
#define _RENDEROBJECT_LUA_H_


#define IMPLEMENTATION_RENDEROBJECT_LUA() \
    std::string GetType() { \
        return GetTypeString(); \
    } \
    LuaTable GetTranslate() { \
        const VX::Math::vec3& v = RenderObject::GetTranslate(); \
        LuaTable t; \
        t.push(v.x); \
        t.push(v.y); \
        t.push(v.z); \
        return t; \
    } \
    LuaTable GetRotate() { \
        const VX::Math::vec3& v = RenderObject::GetRotate(); \
        LuaTable t; \
        t.push(v.x); \
        t.push(v.y); \
        t.push(v.z); \
        return t; \
    } \
    LuaTable GetScale() { \
        const VX::Math::vec3& v = RenderObject::GetScale(); \
        LuaTable t; \
        t.push(v.x); \
        t.push(v.y); \
        t.push(v.z); \
        return t; \
    } \
    LuaTable GetFloatTable() { \
        const FloatMap& m = RenderObject::GetUniformFloat(); \
        FloatMap::const_iterator it, eit = m.end(); \
        LuaTable t; \
        for (it = m.begin(); it != eit; ++it) { \
            t.map(it->first, LuaTable(it->second)); \
        } \
        return t; \
    } \
    LuaTable GetVec2Table() { \
        const Vec2Map& m = RenderObject::GetUniformVec2(); \
        Vec2Map::const_iterator it, eit = m.end(); \
        LuaTable t; \
        for (it = m.begin(); it != eit; ++it) { \
            t.map(it->first, LuaTable(it->second.x, it->second.y)); \
        } \
        return t; \
    } \
    LuaTable GetVec3Table() { \
        const Vec3Map& m = RenderObject::GetUniformVec3(); \
        Vec3Map::const_iterator it, eit = m.end(); \
        LuaTable t; \
        for (it = m.begin(); it != eit; ++it) { \
            t.map(it->first, LuaTable(it->second.x, it->second.y, it->second.z)); \
        } \
        return t; \
    } \
    LuaTable GetVec4Table() { \
        const Vec4Map& m = RenderObject::GetUniformVec4(); \
        Vec4Map::const_iterator it, eit = m.end(); \
        LuaTable t; \
        for (it = m.begin(); it != eit; ++it) { \
            t.map(it->first, LuaTable(it->second.x, it->second.y, it->second.z, it->second.w)); \
        } \
        return t; \
    } \
    float GetFloat(const char* name) { \
        const FloatMap& m = RenderObject::GetUniformFloat(); \
        FloatMap::const_iterator it = m.find(std::string(name)); \
        if (it == m.end()) { \
            return 0.0; \
        } \
        return it->second; \
    } \
    LuaTable GetVec2(const char* name) { \
        const Vec2Map& m = RenderObject::GetUniformVec2(); \
        Vec2Map::const_iterator it = m.find(std::string(name)); \
        if (it == m.end()) { \
            return LuaTable(0.0, 0.0); \
        } \
        return LuaTable(it->second.x, it->second.y); \
    } \
    LuaTable GetVec3(const char* name) { \
        const Vec3Map& m = RenderObject::GetUniformVec3(); \
        Vec3Map::const_iterator it = m.find(std::string(name)); \
        if (it == m.end()) { \
            return LuaTable(0.0, 0.0, 0.0); \
        } \
        return LuaTable(it->second.x, it->second.y, it->second.z); \
    } \
    LuaTable GetVec4(const char* name) { \
        const Vec4Map& m = RenderObject::GetUniformVec4(); \
        Vec4Map::const_iterator it = m.find(std::string(name)); \
        if (it == m.end()) { \
            return LuaTable(0.0, 0.0, 0.0, 0.0); \
        } \
        return LuaTable(it->second.x, it->second.y, it->second.z, it->second.w); \
    }
    
#define DECLARE_RENDEROBJECT_LUA_METHOD() \
    LUA_SCRIPTCLASS_METHOD_ARG0(std::string, GetType) \
    LUA_SCRIPTCLASS_METHOD_ARG3(bool, SetTranslate,float, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG3(bool, SetRotate,float, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG3(bool, SetScale,float, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG3(bool, SetVec2,  const char*, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG4(bool, SetVec3,  const char*, float, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG5(bool, SetVec4,  const char*, float, float, float, float) \
    LUA_SCRIPTCLASS_METHOD_ARG2(bool, SetFloat, const char*, float) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetTranslate) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetRotate) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetScale) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetVec4Table) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetVec3Table) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetVec2Table) \
    LUA_SCRIPTCLASS_METHOD_ARG0(LuaTable, GetFloatTable) \
    LUA_SCRIPTCLASS_METHOD_ARG1(LuaTable, GetVec4, const char*) \
    LUA_SCRIPTCLASS_METHOD_ARG1(LuaTable, GetVec3, const char*) \
    LUA_SCRIPTCLASS_METHOD_ARG1(LuaTable, GetVec2, const char*) \
    LUA_SCRIPTCLASS_METHOD_ARG1(float, GetFloat, const char*)


#endif //_RENDEROBJECT_LUA_H_