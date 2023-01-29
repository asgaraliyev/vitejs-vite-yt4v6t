import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
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

    const items = str
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
        item.commands = item.allTags
          .filter((a) => a.includes('='))
          .map((command) => {
            return {
              name: command.split('=')[0],
              value: command.split('=')[1],
            };
          });
        delete item.authorName;
        delete item.authorNameEndsAt;
        delete item.timeEndIndex;
        delete item.timeStartIndex;
        delete item.str;
        delete item.allTags;
        delete item.tagsArea;
        item.commands.map((command) => {
          if (command.name === 'a') {
            item.amount = parseFloat(command.value);
          } else if (command.name === 'p') {
            item.priority = parseFloat(command.value);
          } else if (command.name === 'year') {
            year = parseFloat(command.value);
          }
        });

        return item;
      });
    console.log(JSON.stringify({ year, items, authors }, null, 1));
  }
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
