import * as UXPinParser from "./UXPinParser";

/**
 * Test data
 */
const simpleCSV = "one, two, three";

const rawCSVData =
`"one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"\r\n"2nd line one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"`;

const iconData = 'icon(CircleSuccess|green 600) \"Done - 2,355 sec\"';

const linkData1 = 'link(\"Call me, maybe?\"|tel:408-555-1212)';
const linkData2 = 'link(UXPin | www.uxpin.com)';
const linkData3 = 'link(UXPin | www.uxpin.com)\n' +
                  'link(UXPin | www.uxpin.com)\n' +
                  'link(UXPin | www.uxpin.com)';

const detailsListData =
"link(Component_Name_A), icon(CircleCheckSolid|color-green-600) Ready, C-1, D-1, icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)\n" +

"link(Component_Name_B), icon(CircleWarningSolid|color-orange-500) Restarting..., C-2, D-2, icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)\n" +

"link(Component_Name_C), icon(CircleClearSolid|color-red-500) Unavailable, C-3, D-3, icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)";

const choiceGroupData =
  "Apples\n" +
  "Bananas\n" +
  "\"I love you, Grapes!\"\n" +
  "Kiwis\n" +
  "Oranges";

/**
 * Tests
 * UXPinParser.split()
 */
test('Empty string should be converted to an empty array', () => {
  expect(UXPinParser.split('   ')).toStrictEqual([]);
});

test('CSV strings should be converted to an array of arrays', () => {
  expect(UXPinParser.split(simpleCSV)).toStrictEqual([
    ["one"," two"," three",]
  ]);

  expect(UXPinParser.split(rawCSVData)).toStrictEqual([
    [
      "one",
      "two with escaped \"\" double quotes\"",
      "three, with, commas",
      "four with no quotes",
      "five with CRLF\r\n"
    ],
    [
      "2nd line one",
      "two with escaped \"\" double quotes\"",
      "three, with, commas",
      "four with no quotes",
      "five with CRLF\r\n"
    ]
  ]);

  expect(UXPinParser.split(iconData)).toStrictEqual([
    ['icon(CircleSuccess|green 600) Done - 2,355 sec']
  ]);

  expect(UXPinParser.split(linkData1)).toStrictEqual([
    ['link(Call me, maybe?|tel:408-555-1212)']
  ]);

  expect(UXPinParser.split(linkData2)).toStrictEqual([
    ['link(UXPin | www.uxpin.com)']
  ]);

  expect(UXPinParser.split(linkData3)).toStrictEqual([
    ['link(UXPin | www.uxpin.com)'],
    ['link(UXPin | www.uxpin.com)'],
    ['link(UXPin | www.uxpin.com)']
  ]);

  expect(UXPinParser.split(detailsListData)).toStrictEqual([
    [
      'link(Component_Name_A)',
      ' icon(CircleCheckSolid|color-green-600) Ready',
      ' C-1',
      ' D-1',
      ' icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)'
    ],
    [
      'link(Component_Name_B)',
      ' icon(CircleWarningSolid|color-orange-500) Restarting...',
      ' C-2',
      ' D-2',
      ' icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)'
    ],
    [
      'link(Component_Name_C)',
      ' icon(CircleClearSolid|color-red-500) Unavailable',
      ' C-3',
      ' D-3',
      ' icon(Document|color-blue-600) icon(MoreVertical|color-blue-600)'
    ]
  ]);

  expect(UXPinParser.split(choiceGroupData)).toStrictEqual([
    [ 'Apples' ],
    [ 'Bananas' ],
    [ 'I love you, Grapes!' ],
    [ 'Kiwis' ],
    [ 'Oranges' ]
  ]);
});

/**
 * Tests
 * UXPinParser.parse()
 */
test('Parser: text', () => {
  expect(UXPinParser.parse(simpleCSV)).toStrictEqual([
    { order: 0, type: "text", text: "one", },
    { order: 1, type: "text", text: "two", },
    { order: 2, type: "text", text: "three", },
  ]);

  expect(UXPinParser.parse(rawCSVData)).toStrictEqual([
    { order: 0, type: 'text', text: 'one' },
    { order: 1, type: 'text', text: 'two with escaped "" double quotes"' },
    { order: 2, type: 'text', text: 'three, with, commas' },
    { order: 3, type: 'text', text: 'four with no quotes' },
    { order: 4, type: 'text', text: 'five with CRLF' },
    { order: 5, type: 'text', text: '2nd line one' },
    { order: 6, type: 'text', text: 'two with escaped "" double quotes"' },
    { order: 7, type: 'text', text: 'three, with, commas' },
    { order: 8, type: 'text', text: 'four with no quotes' },
    { order: 9, type: 'text', text: 'five with CRLF' }
  ]);
});

test('Parser: icon', () => {
  expect(UXPinParser.parse(iconData)).toContainEqual(
    {
      order: 0,
      type: "icon",
      iconName: "CircleSuccess",
      color: "green 600",
      colorToken: undefined,
      text: "Done - 2,355 sec",
    }
  );
});

test('Parser: link', () => {
  expect(UXPinParser.parse(linkData1)).toContainEqual(
    {
      order: 0,
      type: "link",
      text: "Call me, maybe?",
      href: "tel:408-555-1212"
    }
  );

  expect(UXPinParser.parse(linkData2)).toContainEqual(
    {
      order: 0,
      type: "link",
      text: "UXPin ",
      href: "www.uxpin.com"
    }
  );

  expect(UXPinParser.parse(linkData3)).toStrictEqual([
    { order: 0, type: 'link', text: 'UXPin ', href: 'www.uxpin.com' },
    { order: 1, type: 'link', text: 'UXPin ', href: 'www.uxpin.com' },
    { order: 2, type: 'link', text: 'UXPin ', href: 'www.uxpin.com' }
  ]);
});

test('Parser: DetailsList', () => {
  expect(UXPinParser.parse(detailsListData)).toStrictEqual([
    { order: 0, type: 'link', text: 'Component_Name_A', href: undefined },
    {
      order: 1,
      type: 'icon',
      iconName: 'CircleCheckSolid',
      color: 'color-green-600',
      colorToken: undefined,
      text: 'Ready'
    },
    { order: 2, type: 'text', text: 'C-1' },
    { order: 3, type: 'text', text: 'D-1' },
    {
      order: 4,
      type: 'icon',
      iconName: 'Document',
      color: 'color-blue-600',
      colorToken: undefined,
      text: 'icon(MoreVertical|color-blue-600)'
    },
    { order: 5, type: 'link', text: 'Component_Name_B', href: undefined },
    {
      order: 6,
      type: 'icon',
      iconName: 'CircleWarningSolid',
      color: 'color-orange-500',
      colorToken: undefined,
      text: 'Restarting...'
    },
    { order: 7, type: 'text', text: 'C-2' },
    { order: 8, type: 'text', text: 'D-2' },
    {
      order: 9,
      type: 'icon',
      iconName: 'Document',
      color: 'color-blue-600',
      colorToken: undefined,
      text: 'icon(MoreVertical|color-blue-600)'
    },
    {
      order: 10,
      type: 'link',
      text: 'Component_Name_C',
      href: undefined
    },
    {
      order: 11,
      type: 'icon',
      iconName: 'CircleClearSolid',
      color: 'color-red-500',
      colorToken: undefined,
      text: 'Unavailable'
    },
    { order: 12, type: 'text', text: 'C-3' },
    { order: 13, type: 'text', text: 'D-3' },
    {
      order: 14,
      type: 'icon',
      iconName: 'Document',
      color: 'color-blue-600',
      colorToken: undefined,
      text: 'icon(MoreVertical|color-blue-600)'
    }
  ]);
});

test('Parser: ChoiceGroup', () => {
  expect(UXPinParser.parse(choiceGroupData)).toStrictEqual([
    { order: 0, type: "text", text: "Apples", },
    { order: 1, type: "text", text: "Bananas", },
    { order: 2, type: "text", text: "I love you, Grapes!", },
    { order: 3, type: "text", text: "Kiwis", },
    { order: 4, type: "text", text: "Oranges", },
  ]);
});
