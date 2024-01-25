---@diagnostic disable: undefined-global

fx_version 'bodacious'
game 'gta5'

author 'Bursztynek98'
version '1.1.0'

fxdk_watch_command 'yarn' { 'watch' }
fxdk_build_command 'yarn' { 'build' }

yarn_config 'yarn' { 'build' }

client_scripts {
  'dist/client.js',
}
server_scripts {
  'dist/server.js',
  --'@oxmysql/lib/MySQL.lua',
   'example/server-player-time.lua',
}


