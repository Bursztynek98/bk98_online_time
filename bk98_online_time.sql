CREATE TABLE `onlineTime` (
	`identifier` VARCHAR(255) NOT NULL,
	`type` VARCHAR(255) NOT NULL,
	`time` BIGINT NOT NULL DEFAULT 0,
	PRIMARY KEY (`identifier`, `type`)
)
COLLATE='utf8mb4_general_ci'
;