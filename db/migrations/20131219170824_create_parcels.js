var CreateParcels = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('posid', 'string');
          t.column('delivered', 'number');
          t.column('notifyemail', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('parcel', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('parcel', callback);
  };
};

exports.CreateParcels = CreateParcels;
