import React from 'react';


export default ({ header, rows }) => (
  <table border="1" class="datatable">
    <thead>
      <tr style="text-align: center;">
        { header.map(colTitle => <th key={'_' + colTitle}>{colTitle}</th>) }
      </tr>
    </thead>
    <tbody>
      { rows.map((rowEl, index) => (
        <tr>
          { index == 0 ? <th key={'_' + rowEl}>{rowEl}</th> : <td key={'_' + rowEl}>{rowEl}</td> }
        </tr>
      ))}
    </tbody>
  </table>
)
