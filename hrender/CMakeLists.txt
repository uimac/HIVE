cmake_minimum_required(VERSION 2.8)
enable_testing()

PROJECT(hrender)

# macros
#add_definitions(-DDEBUG)

# ------------------------------------------------------------

message(CMAKE_BINARY_DIR ${CMAKE_BINARY_DIR})

# CDMlib depends on BCMTOOLS
IF(HIVE_BUILD_WITH_CDMLIB)
  SET(HIVE_BUILD_WITH_BCMTOOLS On)
ENDIF()

# HDMlib depends on BCMTOOLS
IF(HIVE_BUILD_WITH_HDMLIB)
  SET(HIVE_BUILD_WITH_BCMTOOLS On)
ENDIF()

# --------------------------------------
# 
#  SAME Build Option with SURFACE
#
# Build options
#
# K/FX10 native environment
IF (CMAKE_SYSTEM_PROCESSOR MATCHES "s64fx")

  # Use native Fujitsu compiler
  IF (HIVE_BUILD_WITH_MPI)
    SET(CMAKE_C_COMPILER mpifcc)
    SET(CMAKE_CXX_COMPILER mpiFCC)
  ELSE()
    SET(CMAKE_C_COMPILER fcc)
    SET(CMAKE_CXX_COMPILER FCC)
  ENDIF()

  # gcc compatible flag(-Xg)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Xg")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Xg")

  # PIC flag
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC")

  # OpenMP flag(-Kopenmp)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Kopenmp")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Kopenmp")

  IF (CMAKE_BUILD_TYPE MATCHES "Release")
    SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Kfast")
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Kfast")
  ENDIF()

  # Prevent CMake from adding GNU-specific linker flags (-rdynamic)
  SET(CMAKE_C_COMPILER_ID "Fujitsu" CACHE STRING "Fujitsu C cross-compiler" FORCE)
  SET(CMAKE_CXX_COMPILER_ID "Fujitsu" CACHE STRING "Fujitsu C++ cross-compiler" FORCE)

  # FindOpenMP.cmake does not try -Kopenmp,but the package will try specific
  # flags based on the compier ID.
  SET(OMP_FLAG_Fujitsu "-Kopenmp")
ENDIF()

# K cross compiling
IF (HIVE_BUILD_K_CROSS_COMPILE)

  # Use Fujitsu cross compiler
  IF (HIVE_BUILD_WITH_MPI)
    SET(CMAKE_C_COMPILER mpifccpx)
    SET(CMAKE_CXX_COMPILER mpiFCCpx)
  ELSE()
    SET(CMAKE_C_COMPILER fccpx)
    SET(CMAKE_CXX_COMPILER FCCpx)
  ENDIF()

  # Prevent CMake from adding GNU-specific linker flags (-rdynamic)
  SET(CMAKE_C_COMPILER_ID "Fujitsu" CACHE STRING "Fujitsu C cross-compiler" FORCE)
  SET(CMAKE_CXX_COMPILER_ID "Fujitsu" CACHE STRING "Fujitsu C++ cross-compiler" FORCE)

  # gcc compatible flag(-Xg)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Xg")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Xg")

  # PIC flag
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC")

  # OpenMP flag(-Kopenmp)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Kopenmp")
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Kopenmp")

  IF (CMAKE_BUILD_TYPE MATCHES "Release")
    SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Kfast")
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Kfast")
  ENDIF()

  # FindOpenMP.cmake does not try -Kopenmp,but the package will try specific
  # flags based on the compier ID.
  SET(OMP_FLAG_Fujitsu "-Kopenmp")
  
ELSE()
  IF (CMAKE_SYSTEM_PROCESSOR MATCHES "s64fx")
  ELSE () # assume gcc + linux or macosx
    # PIC flag
    SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC")

    IF (HIVE_BUILD_WITH_OPENMP)
      SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fopenmp")
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fopenmp")
    ENDIF()
  ENDIF()
ENDIF()
# --------------------------------------

# --------------------------------------
# third party lib flags
#
IF(HIVE_BUILD_WITH_CDMLIB)
  add_definitions(-DHIVE_WITH_CDMLIB)
ENDIF()

IF(HIVE_BUILD_WITH_BCMTOOLS)
  add_definitions(-DHIVE_WITH_BCMTOOLS)
ENDIF()

IF(HIVE_BUILD_WITH_PDMLIB)
  add_definitions(-DHIVE_WITH_PDMLIB)
ENDIF()

IF(HIVE_BUILD_WITH_HDMLIB)
  add_definitions(-DHIVE_WITH_HDMLIB)
ENDIF()

IF(HIVE_BUILD_WITH_UDMLIB)
  add_definitions(-DHIVE_WITH_UDMLIB)
ENDIF()

IF(HIVE_BUILD_WITH_COMPOSITOR)
  IF(NOT HIVE_BUILD_WITH_MPI)
    message(FATAL_ERROR "HIVE_BUILD_WITH_MPI must be defined when HIVE_BUILD_WITH_COMPOSIOR is enabled")
  ENDIF()
  add_definitions(-DHIVE_WITH_COMPOSITOR)
ENDIF()

IF(HIVE_BUILD_WITH_PMLIB)
  add_definitions(-DHIVE_WITH_PMLIB)
ENDIF()
# --------------------------------------

# --------------------------------------
# MPI
IF(HIVE_BUILD_WITH_MPI)
  add_definitions(-DHIVE_ENABLE_MPI)
ENDIF()
# --------------------------------------

# Headers
set(INCLUDES
  ${PROJECT_SOURCE_DIR}/../third_party/lua/src
  ${CMAKE_BINARY_DIR}/third_party/lua/
	${PROJECT_SOURCE_DIR}/../third_party/SURFACE/include
	${PROJECT_SOURCE_DIR}/../third_party/SURFACE/gles
	${PROJECT_SOURCE_DIR}/../third_party/SURFACE/render
	${PROJECT_SOURCE_DIR}/../third_party/local
	${PROJECT_SOURCE_DIR}/../third_party/local/include
	${PROJECT_SOURCE_DIR}/../third_party/local/TextParser/include
	${PROJECT_SOURCE_DIR}/../hrender/src/Analyzer
	${PROJECT_SOURCE_DIR}/../hrender/src/Buffer
	${PROJECT_SOURCE_DIR}/../hrender/src/Builder
	${PROJECT_SOURCE_DIR}/../hrender/src/Generator
	${PROJECT_SOURCE_DIR}/../hrender/src/Loader
	${PROJECT_SOURCE_DIR}/../hrender/src/Saver
	${PROJECT_SOURCE_DIR}/../hrender/src/Network
	${PROJECT_SOURCE_DIR}/../hrender/src/RenderObject
	${PROJECT_SOURCE_DIR}/../hrender/src/SceneScript
	${PROJECT_SOURCE_DIR}/../hrender/src/Core
)
INCLUDE_DIRECTORIES(${INCLUDES})


# Links
set(LIBS
	${CMAKE_BINARY_DIR}/third_party/lua
	${PROJECT_SOURCE_DIR}/../third_party/local/lib		# fpzip, zoltan
	${PROJECT_SOURCE_DIR}/../third_party/local/TextParser/lib
)
link_directories(${LIBS})


# Source files
set(SOURCES
	src/Core/main.cpp
	src/Core/Path.cpp
	src/Analyzer/PolygonAnalyzer.cpp
	src/Analyzer/VolumeAnalyzer.cpp
	src/Buffer/Buffer.cpp
	src/Buffer/BufferMeshData.cpp
	src/Buffer/BufferVolumeData.cpp
	src/Buffer/BufferLineData.cpp
	src/Buffer/BufferSparseVolumeData.cpp
	src/Buffer/BufferPointData.cpp
	src/Buffer/BufferVectorData.cpp
	src/Buffer/BufferTetraData.cpp
	src/Buffer/BufferImageData.cpp
	src/Buffer/BufferExtraData.cpp
	src/Builder/FloatsToFloat.cpp
	src/Builder/PointToVolume.cpp
	src/Builder/VolumeToMeshData.cpp
	src/Builder/VolumeToVector.cpp
	src/Builder/SparseVolumeToVolume.cpp
	src/Builder/VolumeFilter.cpp
	src/Builder/CompileUtil.cpp
	src/Builder/MeshAttribToVolume.cpp
	src/Generator/PrimitiveGenerator.cpp
	src/Image/jpge.cpp
	src/Image/jpgd.cpp
	src/Image/lodepng.cpp
	src/Image/tinyexr.cpp
	src/Image/ImageLoader.cpp
	src/Image/GenTexture.cpp
	src/Image/ImageSaver.cpp
	src/Loader/ObjLoader.cpp
	src/Loader/SphLoader.cpp
	src/Loader/StlLoader.cpp
	src/Loader/VolLoader.cpp
	src/Loader/PdbLoader.cpp
	src/Loader/VtkLoader.cpp
	src/Loader/RawVolumeLoader.cpp
	src/Loader/tiny_pdb.cpp
	src/Loader/tiny_vtkxml.cpp
	src/Saver/SphSaver.cpp
	src/Saver/RawVolumeSaver.cpp
	src/Network/Connection.cpp
	src/Network/MetaBinary.cpp
	src/Network/easywsclient.cpp
	src/Network/happyhttp.cpp
	src/RenderObject/Camera.cpp
	src/RenderObject/RenderObject.cpp
	src/RenderObject/PolygonModel.cpp
	src/RenderObject/VolumeModel.cpp
	src/RenderObject/SparseVolumeModel.cpp
	src/RenderObject/LineModel.cpp
	src/RenderObject/PointModel.cpp
	src/RenderObject/TetraModel.cpp
	src/RenderObject/VectorModel.cpp
	src/Renderer/BaseBuffer.cpp
	src/Renderer/Commands_GL.cpp
	src/Renderer/Commands_LSGL.cpp
	src/Renderer/PolygonBuffer.cpp
	src/Renderer/VolumeBuffer.cpp
	src/Renderer/SparseVolumeBuffer.cpp
	src/Renderer/LineBuffer.cpp
	src/Renderer/PointBuffer.cpp
	src/Renderer/TetraBuffer.cpp
	src/Renderer/VectorBuffer.cpp
	src/Renderer/RenderCore.cpp
	src/SceneScript/SceneScript.cpp
	src/SceneScript/SceneScript.cpp
)

IF(HIVE_BUILD_WITH_CDMLIB)

  IF(NOT HIVE_BUILD_WITH_MPI)
    add_definitions(-D_CDM_WITHOUT_MPI_)	# Use stub MPI defines(provided in CDMlib/include/mpi_stubs.h)
  ENDIF()

  SET(CDMLIB_SOURCES
    src/Loader/CdmLoader.cpp
  )

  IF (HIVE_BUILD_K_CROSS_COMPILE) # K specific option.
    SET(NETCDF_LIBS netcdf hdf5_hl hdf5 sz)
  ELSE()
    SET(NETCDF_LIBS netcdf hdf5_hl hdf5)
  ENDIF()

  SET(CDMLIB_LIBS
    CDM ${NETCDF_LIBS} TPmpi
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/CDMlib/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/CDMlib/lib)

  IF (HIVE_BUILD_K_CROSS_COMPILE) # K specific option.
    include_directories(/opt/aics/netcdf/k/include)
    link_directories(/opt/aics/netcdf/k/lib-static)
  ENDIF()
ENDIF()

IF(HIVE_BUILD_WITH_BCMTOOLS)

  SET(BCMTOOLS_SOURCES
    src/Loader/BcmLoader.cpp
  )

  SET(BCMTOOLS_LIBS
    BCM POLYmpi TPmpi
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/BCMTools/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/BCMTools/lib)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/Polylib/lib)
  
ENDIF()

IF(HIVE_BUILD_WITH_HDMLIB)

  SET(HDMLIB_SOURCES
    src/Loader/HdmLoader.cpp
  )

  SET(HDMLIB_LIBS
    HDM TPmpi
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/Polylib/include)
  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/HDMlib/include)
  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/BCMTools/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/HDMlib/lib)
  
ENDIF()

IF(HIVE_BUILD_WITH_PDMLIB)

  SET(PDMLIB_SOURCES
    src/Loader/PdmLoader.cpp
    src/Saver/PdmSaver.cpp
  )

  SET(PDMLIB_LIBS
    PDM TPmpi fpzip zoltan z
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/PDMlib/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/PDMlib/lib)
  
ENDIF()

IF(HIVE_BUILD_WITH_UDMLIB)

  SET(UDMLIB_SOURCES
    src/Loader/UdmLoader.cpp
  )

  SET(UDMLIB_LIBS
    udm TPmpi zoltan cgns
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/Polylib/include)
  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/UDMlib/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/UDMlib/lib)
  
ENDIF()

IF(HIVE_BUILD_WITH_COMPOSITOR)

  SET(COMPOSITOR_LIBS
    234comp
  )

  include_directories(${PROJECT_SOURCE_DIR}/../third_party/local/234Compositor/include)
  link_directories(${PROJECT_SOURCE_DIR}/../third_party/local/234Compositor/lib)
  
ENDIF()

IF(NOT EXECUTABLE_OUTPUT_PATH)
  SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
ENDIF()

add_executable (hrender ${SOURCES} ${CDMLIB_SOURCES} ${BCMTOOLS_SOURCES}
	${HDMLIB_SOURCES} ${PDMLIB_SOURCES} ${UDMLIB_SOURCES})

target_link_libraries(hrender pthread)
target_link_libraries(hrender liblua)
target_link_libraries(hrender LSGLES)
target_link_libraries(hrender ${CDMLIB_LIBS})
target_link_libraries(hrender ${HDMLIB_LIBS})
target_link_libraries(hrender ${UDMLIB_LIBS})
target_link_libraries(hrender ${PDMLIB_LIBS})
target_link_libraries(hrender ${BCMTOOLS_LIBS})
target_link_libraries(hrender ${COMPOSITOR_LIBS})


# Additional Libraries
if (APPLE OR ${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    if(HIVE_BUILD_WITH_BCMTOOLS)
    	add_definitions(-U__BLOCKS__) # work around for BCMlib's Block.h header
    endif()
	find_library(COCOA Cocoa)
	if (NOT COCOA)
	    message(FATAL_ERROR "Cocoa Framework not found")
	endif()
	target_link_libraries(hrender ${COCOA})
endif()



# Copy GLSL Compiler in post build phase
# @todo { Don't copy whole directory files }
SET(GLSLC_OUTPUT_PATH ${EXECUTABLE_OUTPUT_PATH}/glsl)
ADD_CUSTOM_TARGET(glslc-copy-files ALL COMMAND cmake -E copy_directory
	${PROJECT_SOURCE_DIR}/../third_party/SURFACE/glsl
	${EXECUTABLE_OUTPUT_PATH}/glsl)

# NOTE: COPY command only works at CMake configure phase
#file(COPY ${GLSL_PATH} DESTINATION ${EXECUTABLE_OUTPUT_PATH})

# ------------------
# [For develop]

# create symbolic link version (but can't work)
#ADD_CUSTOM_COMMAND(OUTPUT myLinkDebug COMMAND ln;-s;${EXECUTABLE_OUTPUT_PATH}/glsl;${EXECUTABLE_OUTPUT_PATH}/Debug/glsl)
#ADD_CUSTOM_COMMAND(OUTPUT myLinkRelease COMMAND ln;-s;${EXECUTABLE_OUTPUT_PATH}/glsl;${EXECUTABLE_OUTPUT_PATH}/Release/glsl)
#ADD_DEPENDENCIES(hrender myLinkDebug)
#ADD_DEPENDENCIES(hrender myLinkRelease)

# Alt. copy folders
file(COPY ${GLSL_PATH} DESTINATION ${EXECUTABLE_OUTPUT_PATH}/Debug)
file(COPY ${GLSL_PATH} DESTINATION ${EXECUTABLE_OUTPUT_PATH}/Release)
# ------------------

#
# For INSTALL
#
install(TARGETS hrender DESTINATION bin)

#
# for TEST
#
add_test(NAME loader_obj.scn             COMMAND hrender  ../../hrender/test/loader_obj.scn           )
add_test(NAME loader_sph.scn             COMMAND hrender  ../../hrender/test/loader_sph.scn           )
add_test(NAME loader_cdm.scn             COMMAND hrender  ../../hrender/test/loader_cdm.scn           )
add_test(NAME loader_stl.scn             COMMAND hrender  ../../hrender/test/loader_stl.scn           )
add_test(NAME loader_pdb.scn             COMMAND hrender  ../../hrender/test/loader_pdb.scn           )
add_test(NAME loader_vol.scn             COMMAND hrender  ../../hrender/test/loader_vol.scn           )
add_test(NAME volume_to_vector.scn       COMMAND hrender  ../../hrender/test/volume_to_vector.scn     )
add_test(NAME render_basic.scn           COMMAND hrender  ../../hrender/test/render_basic.scn         )
add_test(NAME render_camera.scn          COMMAND hrender  ../../hrender/test/render_camera.scn        )
add_test(NAME render_camera2.scn         COMMAND hrender  ../../hrender/test/render_camera2.scn       )
add_test(NAME render_obj.scn             COMMAND hrender  ../../hrender/test/render_obj.scn           )
add_test(NAME render_sph.scn             COMMAND hrender  ../../hrender/test/render_sph.scn           )
add_test(NAME render_cdm.scn             COMMAND hrender  ../../hrender/test/render_cdm.scn           )
add_test(NAME render_vol.scn             COMMAND hrender  ../../hrender/test/render_vol.scn           )
add_test(NAME render_stl.scn             COMMAND hrender  ../../hrender/test/render_stl.scn           )
add_test(NAME render_pdb.scn             COMMAND hrender  ../../hrender/test/render_pdb.scn           )
add_test(NAME render_pbs.scn             COMMAND hrender  ../../hrender/test/render_pbs.scn           )
add_test(NAME render_with_gentex.scn      COMMAND hrender ../../hrender/test/render_with_gentex.scn    )
add_test(NAME render_with_gentex_F32.scn      COMMAND hrender ../../hrender/test/render_with_gentex_F32.scn    )
add_test(NAME render_vol_gentex3d.scn      COMMAND hrender ../../hrender/test/render_vol_gentex3d.scn    )
add_test(NAME render_mirror_glass.scn      COMMAND hrender ../../hrender/test/render_mirror_glass.scn    )
add_test(NAME render_obj_point.scn       COMMAND hrender  ../../hrender/test/render_obj_point.scn     )
add_test(NAME render_obj_line.scn        COMMAND hrender  ../../hrender/test/render_obj_line.scn      )
add_test(NAME render_obj_normal_vector.scn      COMMAND hrender  ../../hrender/test/render_obj_normal_vector.scn)
add_test(NAME render_obj_extra.scn       COMMAND hrender  ../../hrender/test/render_obj_extra.scn )
add_test(NAME render_sph_vector.scn      COMMAND hrender  ../../hrender/test/render_sph_vector.scn    )
add_test(NAME render_with_texture.scn    COMMAND hrender  ../../hrender/test/render_with_texture.scn    )
add_test(NAME render_cube.scn            COMMAND hrender  ../../hrender/test/render_cube.scn    )
add_test(NAME render_pointlist.scn       COMMAND hrender  ../../hrender/test/render_pointlist.scn    )
add_test(NAME render_transform_obj.scn   COMMAND hrender  ../../hrender/test/render_obj_transform.scn )
add_test(NAME render_transform_sph.scn   COMMAND hrender  ../../hrender/test/render_sph_transform.scn )
#ERROR CASE
add_test(NAME loader_obj_err.scn         COMMAND hrender ../../hrender/test/err/loader_obj_err.scn           )
add_test(NAME loader_sph_err.scn         COMMAND hrender ../../hrender/test/err/loader_sph_err.scn           )
add_test(NAME loader_stl_err.scn         COMMAND hrender ../../hrender/test/err/loader_stl_err.scn           )
add_test(NAME loader_vol_err.scn         COMMAND hrender ../../hrender/test/err/loader_vol_err.scn           )
add_test(NAME render_obj_err.scn         COMMAND hrender ../../hrender/test/err/render_obj_err.scn           )
add_test(NAME render_sph_err.scn         COMMAND hrender ../../hrender/test/err/render_sph_err.scn           )

