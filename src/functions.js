import moment from 'moment';

export function onImportF(str) {
  const authors = [];
  let year;
  function findLatestsAuthorId() {
    const latests = authors.sort((a, b) => a._id - b._id)[0]?._id || 0;
    return latests;
  }
  function checkAuthor(username) {
    const already_exists = authors.find((a) => a.username === username);
    if (already_exists) {
      return already_exists._id;
    }
    const new_author = {
      _id: findLatestsAuthorId() + 1,
      username,
    };
    authors.push(new_author);
    return new_author._id;
  }

  const commands = str
    .split('\n')
    .filter((a) => a)
    .map((a, _id) => {
      const item = {};
      a = a.replace(' ', '').trim();
      item.str = a;
      item._id = _id;
      item.timeStartIndex = a.indexOf('[');
      item.timeEndIndex = a.indexOf(']');
      item.timeStr = a.substring(item.timeStartIndex + 1, item.timeEndIndex);
      a = a.replace(item.timeStr, '').replace('[', '').replace(']', '');
      item.authorName = a.replace(`[${item.timeStr}]`, '');
      item.authorName = item.authorName.split(':')[0];

      item.authorName = item.authorName.replace(':', '').replace(' ', '');
      item.author_id = checkAuthor(item.authorName);
      console.log(
        item.str.replace(item.authorName, '').replace(item.timeStr, '')
      );
      item.tagsArea = item.str
        .replace(item.authorName, '')
        .replace(item.timeStr, '')
        .replace(':', '')
        .replace('[', '')
        .replace(']', '');
      item.allTags = item.tagsArea
        .split('#')
        .map((t) => {
          return t.trim().replace(' ', '');
        })
        .filter((a) => a);
      item.tags = item.allTags.filter((a) => !a.includes('='));
      item.flags = item.allTags
        .filter((a) => a.includes('='))
        .map((flag) => {
          return {
            name: flag.split('=')[0],
            value: flag.split('=')[1],
          };
        });
      delete item.authorName;
      delete item.authorNameEndsAt;
      delete item.timeEndIndex;
      delete item.timeStartIndex;
      delete item.str;
      delete item.allTags;
      delete item.tagsArea;
      item.flags.map((flag) => {
        if (flag.name === 'a') {
          // item.amount = parseFloat(flag.value);
        } else if (flag.name === 'p') {
          // item.priority = parseFloat(flag.value);
        } else if (flag.name === 'year') {
          year = parseFloat(flag.value);
        }
      });
      item.dateObj = {
        month: parseInt(item.timeStr.split('/')[0]),
        day: parseInt(item.timeStr.split(',')[0].split('/')[1]),
        year,
      };
      item.timeSpliterIndex = item.timeStr.indexOf(',');
      item.time = item.timeStr.substring(item.timeSpliterIndex);
      item.time = item.time.replace(',', '').trim();
      item.date = `${item.dateObj.day}/${item.dateObj.month}/${item.dateObj.year} ${item.time}`;
      // item.date = moment(item.date, 'DD/MM/YYYY hh:mm a').toDate();
      delete item.time;
      delete item.timeSpliterIndex;
      delete item.timeStr;
      delete item.dateObj;
      return item;
    });

  const actions = commands
    .filter((command) => {
      return command.flags.find((flag) => flag.name === 'a');
    })
    .map((action) => {
      action.flags.map((flag) => {
        action[flag.name] = flag.value;
      });
      delete action.flags;
      action.p = parseFloat(action.p);
      action.a = parseFloat(action.a);
      action.type = action.a > 0 ? 1 : -1;
      return action;
    });

  return { commands, actions, authors, year };
}
