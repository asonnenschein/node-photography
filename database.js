var bcrypt = require('bcrypt-nodejs')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , Users
  , UsersProfiles
  , Galleries
  , GalleriesRecentAll
  , GalleriesImages
;

var save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model;
  })
};

Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'users_id',
  generateHash: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'));
  },
  galleries: function () {
    return this.hasMany(Galleries, 'galleries_id');
  }
});

UsersProfiles = bookshelf.Model.extend({
  tableName: 'users_profiles',
  idAttribute: 'users_profiles_id',
  user: function () {
    this.belongsTo(Users, 'users_id');
  }
});

Galleries = bookshelf.Model.extend({
  tableName: 'galleries',
  idAttribute: 'galleries_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  galleriesImages: function () {
    return this.hasMany(GalleriesImages, 'galleries_id');
  }
});

GalleriesImages = bookshelf.Model.extend({
  tableName: 'galleries_images',
  idAttribute: 'galleries_images_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  galleries: function () {
    return this.belongsTo(Galleries, 'galleries_id');
  },
});

GalleriesRecentAll = function (limit) {
  var query = knex('galleries_images')
    .join('galleries', 'galleries_images.galleries_id', '=',
      'galleries.galleries_id')
    .select('galleries_images.url_path', 'galleries_images.original_name',
      'galleries_images.name', 'galleries_images.img_title',
      'galleries.url_path AS galleries_path')
    .orderBy('uploaded_datetime', 'desc')
  ;

  if (limit) query.limit(limit);
  return query;
}

module.exports = {
  "Users": Users,
  "Galleries": Galleries,
  "GalleriesRecent": GalleriesRecentAll,
  "GalleriesImages": GalleriesImages,
};