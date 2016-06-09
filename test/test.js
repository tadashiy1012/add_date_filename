const path = require('path');
const fs = require('fs');
const assert = require('power-assert');
const rename = require('../index.js');
const getdt = require('get_dt');

const testDir = path.join(__dirname, 'test_files');

describe('add_date_filename test', () => {
  beforeEach(() => {
    fs.writeFileSync(path.join(testDir, 'hoge1.txt'), 'hoge');
    fs.writeFileSync(path.join(testDir, 'hoge2.txt'), 'hoge');
    fs.writeFileSync(path.join(testDir, 'hoge3.txt'), 'hoge');
  });
  afterEach(() => {
    fs.readdir(testDir, (err, files) => {
      files.filter((file) => file.indexOf('.gitkeep') !== 0).forEach((file) => {
        fs.unlinkSync(path.join(testDir, file));
      });
    });
  });
  it('Pattern of arguments expected', (done) => {
    rename(testDir).then((result) => {
      assert(result !== null);
      assert(result === true);
      fs.readdir(testDir, (err, files) => {
        files.filter((file) => file.indexOf('.gitkeep') !== 0).forEach((file) => {
          const prop = fs.statSync(path.join(testDir, file));
          const birth = prop.birthtime;
          const dstr = getdt(new Date(birth));
          assert(file.substring(0, file.indexOf('_', file.indexOf('_') + 1)) === dstr);
        });
        done();
      })
    });
  });
});