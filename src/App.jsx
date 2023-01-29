import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import moment from 'moment';
function App() {
  const [str, setStr] = React.useState(`
  [1/29, 7:13 PM] AsgarAliyev: #year=2023
  [1/29, 7:14 PM] AsgarAliyev: #taxi #p=1 #a=-3.3`);
  function onImport(str) {
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
        item.authorNameEndsAt = a.substring(item.timeEndIndex).indexOf(':');
        item.authorName = a
          .substring(item.timeEndIndex, item.authorNameEndsAt)
          .replace(' ', '')
          .replace(':', '')
          .replace(' ', '');
        item.author_id = checkAuthor(item.authorName);

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
            item.amount = parseFloat(flag.value);
          } else if (flag.name === 'p') {
            item.priority = parseFloat(flag.value);
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
        item.date = moment(item.date, 'DD/MM/YYYY hh:mm a').toDate();
        delete item.time;
        delete item.timeSpliterIndex;
        delete item.timeStr;
        delete item.dateObj;
        return item;
      });
  }
  React.useEffect(() => {
    onImport(str);
  }, []);
  return (
    <div>
      <textarea
        placeholder="Yapistir..."
        style={{ width: '50vw', height: '50vh' }}
        onChange={(e) => {
          setStr(e.target.value);
        }}
      >
        {str}
      </textarea>
      <button onClick={() => onImport(str)}>Gonder</button>
    </div>
  );
}

export default App;
