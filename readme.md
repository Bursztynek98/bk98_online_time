# Description

- This script is a server-side script!
- This module allows players to easily store their online time
- A perfect second-by-second record of a player's playing time. Where the record to the base occurs every 5 minutes and as the player leaves the server.

# Installation 

- Required Node.js (16.x) or modern

```
yarn install
npm run build
```

# How to use

- look to `example/server-player-time.lua`

Create Timer Instance:
```lua
  local playerTimer = exports.bk98_online_time:onlineTime({
    name = "Uniq Instance Name",
    autoSaveInterval = 1000 * 60 * 5, -- Time Interval to auto save to data base player time
    -- If set 'oxmysql' (getTime, saveTime) is not required and script used self function to save and read data from database
    storeTimeFunction = 'standalone' -- ['oxmysql', 'standalone']

    -- ONLY for storeTimeFunction = 'standalone'
    getTime = function(type, identifier) -- Your function to store player time in database
      return MySQL.scalar.await('SELECT time FROM onlineTime WHERE identifier = ? AND type = ? LIMIT 1', {
        identifier, type
      }) or 0
    end,

    -- ONLY for storeTimeFunction = 'standalone'
    saveTime = function(type, identifier, time) -- Your function to get player time from database
      MySQL.rawExecute.await(
        'INSERT INTO onlineTime (type, identifier, time) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE time=?'
        , {
          type,
          identifier,
          time,
          time,
        })
    end
  })
```

Start and stop Timer:
```lua
  AddEventHandler('playerJoining', function(source)
    playerTimer.joinEvent(GetSteam(source))
  end)

  AddEventHandler('playerDropped', function()
    playerTimer.leftEvent(GetSteam(source))
  end)
```
If you want, you can trigger a special event for a new Timer Instance to store a player character's online time


Basic function to print online time by identifier:
```lua
RegisterCommand("getTime", function(source, args, rawCommand)
    local steam = args[1]
    print(playerTimer.getPlayerTime(steam))
  end, false)
```