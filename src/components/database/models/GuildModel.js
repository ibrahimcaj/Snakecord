const databaseHandler = require('../databaseHandler');

var GuildSchema = new databaseHandler.mongoDatabase.Schema({
    id: { type: String, default: '' },
    premium: { type: Boolean, default: false },
    settings: {
        logging: {
            channel: { type: String, default: '' },
            blacklist: {
                channels: [ String ],
                users: [ String ]
            },
            bots: { type: Boolean, default: true }
        }
    }
});

// ---

GuildSchema.methods.saveDocument = function() {
    return new Promise((resolve, reject) => {
        this.save().then(resolve).catch(reject);
    });
};
GuildSchema.methods.deleteDocument = function() {
    return new Promise((resolve, reject) => {
        module.exports.findOneAndRemove({ id: this.id }, { useFindAndModify: false }).then(resolve).catch(reject);
    });
};

GuildSchema.methods.updateSetting = function(settingName, settingValue) {
    return new Promise((resolve, reject) => {
        this.settings[settingName] = settingValue;
        this.saveDocument().then(resolve).catch(reject);
    });
};
GuildSchema.methods.updateSettings = function(newSettingsObject) {
    return new Promise((resolve, reject) => {
        this.settings = newSettingsObject;
        this.saveDocument().then(resolve).catch(reject);
    });
};
GuildSchema.methods.updateLoggingSetting = function(loggingSettingName, loggingSettingValue) {
    return new Promise((resolve, reject) => {
        this.settings.logging[loggingSettingName] = loggingSettingValue;
        this.saveDocument().then(resolve).catch(reject);
    });
};

// ---

var GuildModel = databaseHandler.mongoDatabase.model('guilds', GuildSchema);
module.exports = GuildModel;