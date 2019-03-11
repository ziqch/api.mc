const createError = require('http-errors');
const moment = require('moment');
/**
 *
 * @param data
 * @param roles
 * @param callback
 */

// roles = {
//   key: [
//     {type, errorMessage}
//   ]
// }
// type: 'required|string|integer|email|regex:/^$/'

module.exports = function (data, roles, callback) {
  let errorList = {};
  for (let key in roles) {
    if (roles.hasOwnProperty(key)) {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        roles[key].forEach(o => {
          switch (true) {
            case (/^required$/.test(o.type)):
              break;
            case (/^length\|(\d+)-(\d+)$/.test(o.type)):
              var res = o.type.match(/^length\|(\d+)-(\d+)$/);
              var min = res[1], max = res[2];
              console.log(min, max)
              console.log(data[key])
              if (data[key].length < min || data[key].length > max) {
                if(o.errorMessage) {
                  pushError(errorList, key, o.errorMessage);
                } else {
                  pushError(errorList, key,'the length of ' + key + 'must be between ' + min + ' and ' + max);
                }
              }
              break;
            case (/^string$/.test(o.type)):
              if (typeof data[key] !== "string") {
                if (o.errorMessage) {
                  pushError(errorList, key, o.errorMessage);
                } else {
                  pushError(errorList, key, key + ' is not a string');
                }
              }
              break;
            case (/^integer$/.test(o.type)):
              if (typeof data[key] !== "number") {
                if (o.errorMessage) {
                  pushError(errorList, key, o.errorMessage);
                } else {
                  pushError(errorList, key, key + ' is not a number');
                }
              }
              break;
            case (/^email$/.test(o.type)):
              if (!/^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(data[key])) {
                if (o.errorMessage) {
                  pushError(errorList, key, o.errorMessage);
                } else {
                  pushError(errorList, key, key + ' is a invalid email');
                }
              }
              break;
            case (/^regex:\/.*\/$/.test(o.type)):
              let regex = new RegExp(o.type.match(/^regex:\/(.*)\/$/)[1])
              if (regex) {
                if (!regex.test(data[key])) {
                  if (o.errorMessage) {
                    pushError(errorList, key, o.errorMessage);
                  } else {
                    pushError(errorList, key, key + ' is invalid');
                  }
                }
              } else {
                throw 'role::regex error';
              }
              break;
            case (/^date$/.test(o.type)):
              try {
                moment(data[key]);
              } catch (e) {
                pushError(errorList, key, key + ' is invalid');
                break;
              }
              if (!moment(data[key]).isValid()) {
                if (o.errorMessage) {
                  pushError(errorList, key, o.errorMessage);
                } else {
                  pushError(errorList, key, key + ' is invalid');
                }
              }
              break;
            default:
              throw 'role unsupported';
          }
        })
      } else {
        roles[key].forEach(o => {
          if (o.type === 'required') {
            if (o.errorMessage) {
              pushError(errorList, key, o.errorMessage);
            } else {
              pushError(errorList, key, key + ' is required');
            }
          }
        })
      }
    } else {
      throw 'role property undefined'
    }
  }
  if (JSON.stringify(errorList) === '{}') {
    callback(null)
  } else {
    callback(createError(422, {message:errorList}));
  }
};


function pushError(list, key, item) {
  if(list.hasOwnProperty(key)) {
    list[key].push(item)
  } else {
    list[key] = [];
    list[key].push(item)
  }
}
