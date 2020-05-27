const moment = require('moment');
const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  FORBIDDEN_TEXT
} = require('../utilities');
const handleGetServerDateTime = async (req, res) => {
  if (req.method !== httpRequestMethods.GET) {
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  return cors(req, res, () => {
    let {
      format
    } = req.query;
    if (!format) {
      format = req.body.format;
    }
    const formattedDate = moment().format(format);
    //console.log('Server Date Time:', formattedDate);
    res.status(200).send(formattedDate);
  });
};

exports.handleGetServerDateTime = handleGetServerDateTime;