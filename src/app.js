const Koa = require('koa');
const Path = require('path');
const Fs = require('fs');
const MimeTypes = require('mime-types');

const pathPrefix = Path.resolve('/projects/static-assets');
const app = new Koa();
const port = 3000;

function getFile(path) {
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
  const filePath = Path.join(pathPrefix, ctx.path)
  const [resSuccess, resData] = await getFile(filePath);
  if (resSuccess) {
    ctx.staus = 200;
    ctx.set('access-control-allow-origin', '*');
    ctx.set('content-type', MimeTypes.lookup(filePath));
    ctx.body = resData;
  } else {
    ctx.status =  resData.code === 'ENOENT' ? 404 : 500;
  }
});

app.listen(port);