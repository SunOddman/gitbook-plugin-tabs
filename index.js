var markdown = require('gitbook-markdown');
var COUNTER = 0;

function hehe(block) {
  var body = markdown.page(block.body).content;
  // var blocks = block.blocks.filter(function (subBlock) {
  //   return subBlock;
  // });
  var leftBody = markdown.page(block.blocks[0].body).content;
  var rightBody = markdown.page(block.blocks[1].body).content;

  return `
    <div class="class-multi-columns">
      ${body}
      <div class="column-left">
      ${leftBody}
      </div>
      <div class="column-right">
      ${rightBody}
      </div>
    </div>
  `;
}
function kitchenSink(block) {
  var isFirstTab = true;

  // Filter out any blocks the user doesn't need
  var blocks = block.blocks.filter(function(subBlock) {
    return block.kwargs[subBlock.name];
  });

  var tabs = blocks.map(function(subBlock) {
    subBlock.id = subBlock.name + '-' + ++COUNTER;
    subBlock.isActive = false;
    var href = '#' + subBlock.id;
    var classString = '';
    if (isFirstTab) {
      classString = 'active';
      subBlock.isActive = true;
      isFirstTab = false;
    }

    return `
      <li role="presentation" class="${classString}">
        <a href="${href}" role="tab" data-toggle="tab">
          ${block.kwargs[subBlock.name]}
        </a>
      </li>
    `;
  }).join('');

  var tabContent = blocks.map(function(subBlock) {
    var classString = 'tab-pane';
    if (subBlock.isActive) {
      classString += ' active';
    }

    return `
      <div role="tabpanel" class="${classString}" id="${subBlock.id}">
        ${markdown.page(subBlock.body).content}
      </div>
    `;
  }).join('');

  return `
    <ul class="nav nav-tabs" role="tablist">
      ${tabs}
    </ul>
    <div class="tab-content">
      ${tabContent}
    </div>
  `;
}

module.exports = {

  book: {
    assets: './assets',
    css: [
      'bootstrap.css',
      'multi_column.css'
    ],
    js: [
      'bootstrap.js'
    ]
  },

  blocks: {
    tabs: {
      blocks: ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9', 'tab10'],
      process: function(block) {
        return kitchenSink(block);
      }
    },
    testTab: {
      blocks: ['left', 'right'],
      process: function (block) {
        return hehe(block);
      }
    }
  }

};
