MySQL.ready(function()
  local playerTimer = exports.bk98_online_time:onlineTime({
    name = "playerTimer",
    autoSaveInterval = 1000 * 60 * 5,
    getTime = function(type, identifier)
      return MySQL.scalar.await('SELECT time FROM onlineTime WHERE identifier = ? AND type = ? LIMIT 1', {
        identifier, type
      }) or 0
    end,
    saveTime = function(type, identifier, time)
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

  function GetSteam(source)
    local identifiers = GetPlayerIdentifiers(source)
    for _, v in pairs(identifiers) do
      if string.find(v, "steam") then
      -- if string.find(v, "license") then
        return v
      end
    end
  end

  AddEventHandler('playerJoining', function(source)
    playerTimer.joinEvent(GetSteam(source))
  end)

  AddEventHandler('playerDropped', function()
    playerTimer.leftEvent(GetSteam(source))
  end)


  RegisterCommand("getTime", function(source, args, rawCommand)
    local steam = args[1]
    print(playerTimer.getPlayerTime(steam))
  end, false)
end)
