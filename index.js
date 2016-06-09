const fs = require('fs');
const path = require('path');
const reader = require('filelist_reader');
const getdt = require('get_dt');

function getNewName(tgtDir, file) {
  const promise = new Promise((resolve, reject) => {
    const prop = fs.statSync(path.join(tgtDir, file));
    const birth = prop.birthtime;
    const dstr = getdt(new Date(birth));
    resolve([file, dstr + '_' + file]);
  });
  return promise;
}

function rename(tgtFilePath, newNamePath) {
  const promise = new Promise((resolve, reject) => {
    fs.rename(tgtFilePath, newNamePath, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
  return promise;
}

module.exports = function(tgtDir) {
  const promise = new Promise((resolve, reject) => {
    reader(tgtDir).then((result) => {
      Promise.all(result.map((file) => {
        return getNewName(tgtDir, file);
      })).then((value) => {
        Promise.all(value.map((name) => {
          return rename(path.join(tgtDir, name[0]), path.join(tgtDir, name[1]));
        })).then(() => {
          resolve(true);
        });
      });
    });
  });
  return promise;
};