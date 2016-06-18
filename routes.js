var _ = require('lodash')
  , config = require('./config.json')
  , gm = require('gm')
  , path = require('path')
;

module.exports = function (db) {

  var getUser
    , updateUser
    , getGalleries
    , getGallery
    , createGallery
    , HTMLFormPutDeleteGallery
    , HTMLFormPutDeleteGalleriesImage
    , updateGallery
    , getGalleriesImages
    , getGalleriesImage
    , createGalleriesImage
    , updateGalleriesImage
    , deleteGalleriesImage
    , getAbout
    , getContact
    , postAbout
    , postContact
  ;


  // User Routes =============================================================

  getUser = function (req, res, next) {
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
  }

  updateUser = function (req, res, next) {
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
  }

  // Galleries Routes ========================================================

  getGalleries = function (req, res, next) {
    var path = req.path.replace(/\//g, "")
      , limit = path === 'recent' ? 20 : null
    ;

    if (path === 'recent' || path === 'all') {
      db.GalleriesRecent(limit)
        .then(function (images) {
          if (req.query.mime === 'json') {
            return res.status(200).send(images);
          }
          return next();
        })
        .catch(function (error) {
          return res.status(404).send("Could not get galleries!");
        })
      ;
    }
    else {
      new db.Galleries().fetchAll({withRelated: 'galleriesImages'})
        .then(function (galleries) {
          if (req.query.mime === 'json') {
            galleries.unshift([{"title": "Recent", "url_path": "recent"},
              {"title": "All", "url_path": "all"}]);
            return res.status(200).send(galleries);
          }
          else {
            return next();
          }
        })
        .catch(function (error) {
          return res.status(404).send("Could not get galleries!");
        })
      ;
    }
  }

  getGallery = function (req, res, next) {
    new db.Galleries({ url_path: req.params.gallery })
      .fetch({withRelated: 'galleriesImages'})
      .then(function (gallery) {
        if (req.query.mime === 'json') {
          return res.status(200).send(gallery);
        }
        else {
          return next();
        }
      })
      .catch(function (error) {
        return res.status(404).send("Could not get gallery!");
      })
    ;
  }

  createGallery = function (req, res, next) {
    var username = req.user.get('username');
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
                  "img_title": req.body.img_title,
                  "caption": req.body.caption,
                  "upload_ip": req.ip,
                  "order_number": 1,
                  "cover_image": true
                };

                new db.GalleriesImages(imagesData).save()
                  .then(function (image) {
                    image = image.toJSON();
                    image["gallery_path"] = gallery.get("url_path");

                    var thumbPath = path.join(config.thumbnails,
                      image.name);

                    gm(image.directory)
                      .resize('300', '300', '^')
                      .gravity('center')
                      .crop('300', '300')
                      .write(thumbPath, function (err) {
                        if (err) {
                          return res.status(404)
                            .send("Could not upload image!");
                        } else {
                          res.redirect('/users/' + username + '/#/manage');
                        }
                      })
                    ;
                  })
                  .catch(function (error) {
                    console.log(error);
                    return res.status(404).send("Could not upload image!");
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
  }

  updateGallery = function (req, res, next) {
    var username = req.user.get('username');
    new db.Galleries({ url_path: req.params.gallery }).fetch()
      .then(function (gallery) {

        if (!gallery)
          return res.status(400).send("Could not update gallery!");

        if (gallery.get('users_id') === req.user.id) {
          var urlPath;
          req.body.title = req.body.title
            ? req.body.title
            : gallery.get('title')
          ;
          req.body.description = req.body.description
            ? req.body.description
            : gallery.get('description')
          ;
          urlPath = req.body.title.replace(/ /g,'').toLowerCase();
          req.body.url_path = urlPath;
          gallery.save(req.body, { method: 'update' })
            .then(function (update) {
              return res.redirect('/users/' + username + '/#/manage');
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
  }

  deleteGallery = function (req, res, next) {
    new db.Galleries({ url_path: req.params.gallery }).fetch()
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
  }

  HTMLFormPutDeleteGallery = function (req, res, next) {
    if (req.body._method && req.body._method === "DELETE") {
      deleteGallery(req, res, next);
    }
    else {
      updateGallery(req, res, next);
    }
  }

  // Galleries Images Routes =================================================

  getGalleriesImages = function (req, res, next) {
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
  }

  getGalleriesImage = function (req, res, next) {
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
  }

  createGalleriesImage = function (req, res, next) {
    var username = req.user.get('username');
    new db.Galleries({ url_path: req.params.gallery })
      .fetch({ withRelated: ['galleriesImages'] })
      .then(function (gallery) {
        if (gallery && gallery.get('users_id') === req.user.id) {

          var imgUrlPath, imagesData, existingImages;

          imgUrlPath = req.files.file.originalname
            .replace(/ /g,'').toLowerCase();

          existingImages = gallery.related('galleriesImages');

          imagesData = {
            "galleries_id": gallery.id,
            "users_id": req.user.id,
            "size": req.files.file.size,
            "directory": req.files.file.path,
            "original_name": req.files.file.originalname,
            "url_path": imgUrlPath,
            "name": req.files.file.name,
            "img_title": req.body.img_title,
            "caption": req.body.caption,
            "upload_ip": req.ip,
            "order_number": existingImages.length + 1,
            "cover_image": false
          };

          new db.GalleriesImages(imagesData).save()
            .then(function (image) {
              image = image.toJSON();
              image["gallery_path"] = gallery.get("url_path");

              var thumbPath = path.join(config.thumbnails, image.name);

              gm(image.directory)
                .resize('300', '300', '^')
                .gravity('center')
                .crop('300', '300')
                .write(thumbPath, function (err) {
                  if (err) {
                    return res.status(404).send("Could not upload image!");
                  }
                  else {
                    res.redirect('/users/' + username + '/#/manage');
                  }
                })
              ;
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
  }

  updateGalleriesImage = function (req, res, next) {
    var username = req.user.get('username');
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
              var urlPath;
              req.body.img_title = req.body.img_title
                ? req.body.img_title
                : image.get('img_title')
              ;
              req.body.caption = req.body.caption
                ? req.body.caption
                : image.get('caption')
              ;
              urlPath = req.body.img_title.replace(/ /g,'').toLowerCase();
              req.body.url_path = urlPath;
              image.save(req.body, { method: 'update' })
                .then(function (update) {
                  res.redirect('/users/' + username + '/#/manage');
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
  }

  deleteGalleriesImage = function (req, res, next) {
    var username = req.user.get('username');
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
                    res.redirect('/users/' + username + '/#/manage');
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

  }

  HTMLFormPutDeleteGalleriesImage = function (req, res, next) {
    if (req.body._method && req.body._method === "DELETE") {
      deleteGalleriesImage(req, res, next);
    }
    else {
      updateGalleriesImage(req, res, next);
    }
  }

  // About & Contact Routes ====================================================

  getAbout = function (req, res, next) {
    new db.UsersProfiles().fetchAll()
      .then(function (profile) {
        if (req.query.mime === 'json') {
          return res.status(200).send(profile);
        }
        return next();
      })
      .catch(function (error) {
        console.log(error);
        return res.status(404).send("Could not get about!");
      })
    ;
  }

  getContact = function (req, res, next) {
    new db.UsersProfiles().fetchAll()
      .then(function (contact) {
        if (req.query.mime === 'json') {
          return res.status(200).send(contact);
        }
        return next();
      })
      .catch(function (error) {
        console.log(error);
        return res.status(404).send("Could not get contact!");
      })
    ;
  }

  postAbout = function (req, res, next) {
    var users_id = req.user.get('users_id');
    new db.UsersProfiles({users_id: users_id}).fetch()
      .then(function (exists) {

        var aboutData = {
          "users_id": users_id,
          "about": req.body.about
        };

        if (exists) {
          exists.save(aboutData, {method: 'update'})
            .then(function (success) {
              return res.redirect('/about/');
            })
            .catch(function (error) {
              return res.status(404).send("Could not update POST data!");
            })
          ;
        }
        else {
          new db.UsersProfiles(aboutData).save()
            .then(function (success) {
              return res.redirect('/about/');
            })
            .catch(function (error) {
              return res.status(404).send("Could POST about data!");
            })
          ;
        }
      })
      .catch(function (error) {
        console.log(error);
        return res.status(404).send("Could not get about!");
      })
    ;
  }

  postContact = function (req, res, next) {
    var users_id = req.user.get('users_id');
    new db.UsersProfiles({users_id: users_id}).fetch()
      .then(function (exists) {

        var contactData = {
          "users_id": users_id,
          "contact": req.body.contact
        };

        if (exists) {
          exists.save(contactData, {method: 'update'})
            .then(function (success) {
              return res.redirect('/contact/');
            })
            .catch(function (error) {
              return res.status(404).send("Could not update POST data!");
            })
          ;
        }
        else {
          new db.UsersProfiles(contactData).save()
            .then(function (success) {
              return res.redirect('/contact/');
            })
            .catch(function (error) {
              return res.status(404).send("Could POST contact data!");
            })
          ;
        }
      })
      .catch(function (error) {
        console.log(error);
        return res.status(404).send("Could not get contact!");
      })
    ;
  }

  return {
    getUser: getUser,
    updateUser: updateUser,
    getGalleries: getGalleries,
    getGallery: getGallery,
    createGallery: createGallery,
    HTMLFormPutDeleteGallery: HTMLFormPutDeleteGallery,
    updateGallery: updateGallery,
    deletegallery: deleteGallery,
    getGalleriesImages: getGalleriesImages,
    getGalleriesImage: getGalleriesImage,
    createGalleriesImage: createGalleriesImage,
    updateGalleriesImage: updateGalleriesImage,
    deleteGalleriesImage: deleteGalleriesImage,
    HTMLFormPutDeleteGalleriesImage: HTMLFormPutDeleteGalleriesImage,
    getAbout: getAbout,
    getContact: getContact,
    postAbout: postAbout,
    postContact: postContact
  }
}
