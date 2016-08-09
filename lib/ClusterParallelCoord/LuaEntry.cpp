#include "LuaUtil.h"
#include "VolumeClustering_Lua.h"

extern "C" {

int luaopen_ClusterParallelCoord(lua_State* L)
{
    LUA_SCRIPTCLASS_REGISTER(L, VolumeClustering_Lua);
    lua_newtable(L);
    lua_pushstring(L, "VolumeClustering");
    lua_pushcfunction(L, LUA_SCRIPTCLASS_NEW_FUNCTION(VolumeClustering_Lua));
    lua_settable(L, -3);

    return 1;
}

}

