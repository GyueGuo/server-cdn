const Koa = require('koa');
const Path = require('path');
const Fs = require('fs');
const MimeTypes = require('mime-types');

const pathPrefix = Path.resolve('assets');
const app = new Koa();
const port = 3000;

function getImg(path) {
  return new Promise(function (resolve, reject) {
    Fs.readFile(path, (err, data) => {
      if (err) {
        resolve([false, err]);
      } else {
        resolve([true, data]);
      }
    });
  });
}
app.use(async (ctx) => {
  const imgPath = Path.join(pathPrefix, ctx.path)
  const [resSuccess, resData] = await getImg(imgPath);
  if (resSuccess) {
    ctx.staus = 200;
    ctx.set('content-type', MimeTypes.lookup(imgPath));
    ctx.body = resData;
  } else {
    ctx.status =  resData.code === 'ENOENT' ? 404 : 500;
  }
});

app.listen(port);