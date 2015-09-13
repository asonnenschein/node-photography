var _ = require('lodash');

module.exports = function (db) {

  return {

    // User Routes =============================================================

    getUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(404).send("User does not exist!");
          var package = {
            usersData: {
              username: data.get('username'),
              id: data.get('users_id')
            }
          };
          return next();
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    updateUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(400).send("Could not update user!");

          if (req.body.password) {
            req.body.password = this.generateHash(req.body.password);
          }

          data.save(req.body, { method: 'update' })
            .then(function (update) {
              return res.status(200).send(update);
            })
            .catch(function (error) {
              return res.status(400).send("Could not update user!");
            })
          ;

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    // Galleries Routes ========================================================

    getGalleries: function (req, res, next) {
      new db.Galleries().fetchAll()
        .then(function (galleries) {
          return res.status(200).send(galleries);
        })
        .catch(function (error) {
          return res.status(404).send("Could not get galleries!");
        })
      ;
    },

    getGallery: function (req, res, next) {
      new db.Galleries({ name: req.params.gallery }).fetch()
        .then(function (gallery) {
          return res.status(200).send(gallery);
        })
        .catch(function (error) {
          return res.status(404).send("Could not get gallery!");
        })
      ;
    },

    createGallery: function (req, res, next) {
      new db.Users({ users_id: req.user.id }).fetch()
        .then(function (users) {

          var urlPath = req.body.title.replace(/ /g,'').toLowerCase();

          new db.Galleries({ url_path: urlPath }).fetch()
            .then(function (exists) {
              if (exists) return res.status(409).send("Gallery exists!");

              var galleriesData = {
                "users_id": users.id,
                "title": req.body.title,
                "url_path": urlPath,
                "description": req.body.description
              };

              new db.Galleries(galleriesData).save()
                .then(function (gallery) {

                  var imgUrlPath, imagesData;

                  imgUrlPath = req.files.file.originalname
                    .replace(/ /g,'').toLowerCase();

                  imagesData = {
                    "galleries_id": gallery.id,
                    "users_id": users.id,
                    "size": req.files.file.size,
                    "directory": req.files.file.path,
                    "original_name": req.files.file.originalname,
                    "url_path": imgUrlPath,
                    "name": req.files.file.name,
                    "caption": req.body.caption,
                    "upload_ip": req.ip,
                    "order_number": req.body.order_number,
                    "cover_image": req.body.cover_image
                  };

                  new db.GalleriesImages(imagesData).save()
                    .then(function (image) {
                      image = image.toJSON();
                      image["gallery_path"] = gallery.get("url_path");
                      return res.status(200).send(image);
                    })
                    .catch(function (error) {
                      res.status(404).send("Could not upload image!");
                    })
                  ;

                })
                .catch(function (error) {
                  return res.status(404).send("Could not create gallery!");
                })
              ;

            })
            .catch(function (error) {
              return res.status(404).send("Could not create gallery!");
            })
          ;

        })
        .catch(function (error) {
          return res.status(404).send("User not authorized to upload file!");
        })
      ;
    },

    updateGallery: function (req, res, next) {
      new db.Galleries({ name: req.params.gallery }).fetch()
        .then(function (gallery) {

          if (!gallery)
            return res.status(400).send("Could not update gallery!");

          if (gallery.get('users_id') === req.user.id) {
            gallery.save(req.body, { method: 'update' })
              .then(function (update) {
                return res.status(200).send(update);
              })
              .catch(function (error) {
                return res.status(400).send("Could not update gallery!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to update gallery!");
          }

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteGallery: function (req, res, next) {
      new db.Galleries({ name: req.params.gallery }).fetch()
        .then(function (gallery) {
          if (gallery.get('users_id') === req.user.id) {
            gallery.destroy()
              .then(function (success) {
                return res.status(200).end();
              })
              .catch(function (error) {
                return res.status(404).send("Could not delete gallery!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to delete gallery!");
          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not delete gallery!");
        })
      ;
    },

    // Galleries Images Routes =================================================

    getGalleriesImages: function (req, res, next) {
      new db.GalleriesImages({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (submission.get('name') === req.params.submission) {
            return res.status(200).send(file);
          }
        })
        .catch(function (error) {
          return res.status(404).send("Could not get file!");
        })
      ;
    },

    getGalleriesImage: function (req, res, next) {
      new db.Galleries({ url_path: req.params.gallery })
        .fetchAll({ withRelated: ['galleriesImages'] })
        .then(function (files) {
          var image = files.models[0].toJSON();
          _.each(image.galleriesImages, function(image) {
            if (image.url_path === req.params.image) {
              image["gallery_path"] = image.url_path;
              return res.status(200).send(image);
            }
          });
        })
        .catch(function (error) {
          return res.status(404).send("Could not get file!");
        })
      ;
    },

    createGalleriesImage: function (req, res, next) {
      new db.Galleries({ url_path: req.params.gallery }).fetch()
        .then(function (gallery) {
          if (gallery && gallery.get('users_id') === req.user.id) {

            var imgUrlPath, imagesData;

            imgUrlPath = req.files.file.originalname
              .replace(/ /g,'').toLowerCase();

            imagesData = {
              "galleries_id": gallery.id,
              "users_id": req.user.id,
              "size": req.files.file.size,
              "directory": req.files.file.path,
              "original_name": req.files.file.originalname,
              "url_path": imgUrlPath,
              "name": req.files.file.name,
              "caption": req.body.caption,
              "upload_ip": req.ip,
              "order_number": req.body.order_number,
              "cover_image": req.body.cover_image
            };

            new db.GalleriesImages(imagesData).save()
              .then(function (image) {
                image = image.toJSON();
                image["gallery_path"] = gallery.get("url_path");
                return res.status(200).send(image);
              })
              .catch(function (error) {
                res.status(404).send("Could not upload image!");
              })
            ;

          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not upload file!");
        })
      ;
    },

    updateGalleriesImage: function (req, res, next) {
      new db.Galleries({ url_path: req.params.gallery }).fetch()
        .then(function (gallery) {
          if (gallery && gallery.get('users_id') === req.user.id) {

            new db.GalleriesImages({
              galleries_id: gallery.id,
              url_path: req.params.image
            })
            .fetch()
            .then(function (image) {
              if (!image) {
                return res.status(400).send("File does not exist!");
              }
              else {
                image.save(req.body, { method: 'update' })
                  .then(function (update) {
                    return res.status(200).send(update);
                  })
                  .catch(function (error) {
                    return res.status(400).send("Could not update image!");
                  })
                ;
              }
            })
            .catch(function (error) {
              return res.status(500).send("Internal server error!");
            });

          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteGalleriesImage: function (req, res, next) {
      new db.Galleries({ url_path: req.params.gallery }).fetch()
        .then(function (gallery) {
          if (gallery && gallery.get('users_id') === req.user.id) {

            var query = {galleries_id: gallery.id, url_path: req.params.image};

            new db.GalleriesImages(query).fetch()
              .then(function (image) {
                if (!image) {
                  return res.status(400).send("File does not exist!");
                }
                else {
                  image.destroy()
                    .then(function (success) {
                      return res.status(200).end();
                    })
                    .catch(function (error) {
                      return res.status(400).send("Could not delete file!");
                    })
                  ;
                }
              })
              .catch(function (error) {
                return res.status(400).send("Could not delete file!");
              })
            ;

          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;

    },

  };

};