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

const compoundToken = "link(Tahlia|http://www.paypal.com) ran a new system test. icon(Home|orange)";



/**
 * Tests
 * UXPinParser.split()
 */
test('Split: Empty string should be converted to an empty array', () => {
  expect(UXPinParser.split('   ')).toStrictEqual([]);
});

test('Split: CSV strings should be converted to an array of arrays', () => {
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

  expect(UXPinParser.split(compoundToken)).toStrictEqual([
    [ 'link(Tahlia|http://www.paypal.com) ran a new system test. icon(Home|orange)' ],
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
      color: undefined,
      colorToken: "green 600",
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
      text: "UXPin",
      href: "http://www.uxpin.com"
    }
  );

  expect(UXPinParser.parse(linkData3)).toStrictEqual([
    { order: 0, type: 'link', text: 'UXPin', href: 'http://www.uxpin.com' },
    { order: 1, type: 'link', text: 'UXPin', href: 'http://www.uxpin.com' },
    { order: 2, type: 'link', text: 'UXPin', href: 'http://www.uxpin.com' }
  ]);
});

test('Parser: DetailsList', () => {
  expect(UXPinParser.parse(detailsListData)).toStrictEqual([
    { order: 0, type: 'link', text: 'Component_Name_A', href: undefined },
    {
      order: 1,
      type: 'icon',
      iconName: 'CircleCheckSolid',
      color: undefined,
      colorToken: 'color-green-600',
      text: 'Ready'
    },
    { order: 2, type: 'text', text: 'C-1' },
    { order: 3, type: 'text', text: 'D-1' },
    {
      order: 4,
      type: 'compound',
      value: [
        {
          order: 0,
          type: 'icon',
          iconName: 'Document',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        },
        {
          order: 1,
          type: 'icon',
          iconName: 'MoreVertical',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        }
      ],
    },
    { order: 5, type: 'link', text: 'Component_Name_B', href: undefined },
    {
      order: 6,
      type: 'icon',
      iconName: 'CircleWarningSolid',
      color: undefined,
      colorToken: 'color-orange-500',
      text: 'Restarting...'
    },
    { order: 7, type: 'text', text: 'C-2' },
    { order: 8, type: 'text', text: 'D-2' },
    {
      order: 9,
      type: 'compound',
      value: [
        {
          order: 0,
          type: 'icon',
          iconName: 'Document',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        },
        {
          order: 1,
          type: 'icon',
          iconName: 'MoreVertical',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        },
      ]
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
      color: undefined,
      colorToken: 'color-red-500',
      text: 'Unavailable'
    },
    { order: 12, type: 'text', text: 'C-3' },
    { order: 13, type: 'text', text: 'D-3' },
    {
      order: 14,
      type: 'compound',
      value: [
        {
          order: 0,
          type: 'icon',
          iconName: 'Document',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        },
        {
          order: 1,
          type: 'icon',
          iconName: 'MoreVertical',
          color: undefined,
          colorToken: 'color-blue-600',
          text: ''
        }
      ]
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

test('Parser: Compound Token', () => {
  expect(UXPinParser.parse(compoundToken)).toStrictEqual([
    {
      order: 0,
      type: "compound",
      value: [
        {
          order: 0,
          type: "link",
          text: "Tahlia",
          href: "http://www.paypal.com"
        },
        {
          order: 1,
          type: "text",
          text: "ran a new system test."
        },
        {
          order: 2,
          type: "icon",
          iconName: "Home",
          color: undefined,
          colorToken: "orange",
          text: ""
        }
      ]}
  ]);
});



/**
 * Data Tests
 */

//This is an example of what could be in a single Text control, or in an ActivityItem's Description prop.
//Also, equivalent to a single cell (or block) of a DataTable.
const blockTest1 = `Tahlia ran a new system test. link(More Info|http://www.uxpin.com) icon(Info|themePrimary) And it passed!`;

test('Data Test: Compound Token Starting and Ending with Text', () => {
  expect(UXPinParser.parse(blockTest1)).toStrictEqual([
    {
      order: 0,
      type: 'compound',
      value: [
        {
          order: 0,
          type: 'text',
          text: 'Tahlia ran a new system test.',
        },
        {
          order: 1,
          type: 'link',
          text: "More Info",
          href: 'http://www.uxpin.com',
        },
        {
          order: 2,
          type: 'icon',
          iconName: 'Info',
          // color: '#0078d4' //using UxpColors.getHexFromHexOrToken(),
          color: undefined,
          colorToken: 'themePrimary',
          text: '',
        },
        {
          order: 3,
          type: 'text',
          text: 'And it passed!',
        },
      ]
    }
  ]);
});

//For Nav without icons.
const navTest1 = `Home
Products
About Us`;

test('Data Test: navTest1', () => {
  expect(UXPinParser.parse(navTest1)).toStrictEqual([
    {
      order: 0,
      type: 'text',
      text: 'Home'
    },
    {
      order: 1,
      type: 'text',
      text: 'Products'
    },
    {
      order: 2,
      type: 'text',
      text: 'About Us'
    },
   ]);
 });

//For Nav with icons.
const navTest2 = `icon(Home) Home
icon(ProductVariant) Products
icon(Info) About Us`;

test('Data Test: navTest2', () => {
  expect(UXPinParser.parse(navTest2)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Home',
      color: undefined,
      colorToken: undefined,
      text: 'Home'
    },
    {
      order: 1,
      type: 'icon',
      iconName: 'ProductVariant',
      color: undefined,
      colorToken: undefined,
      text: 'Products'
    },
    {
      order: 2,
      type: 'icon',
      iconName: 'Info',
      color: undefined,
      colorToken: undefined,
      text: 'About Us'
    }
  ]);
});

//With fully qualified HREF
const linkTest1 = 'link(Visit UXPin|http://www.uxpin.com)';

test('Data Test: linkTest1', () => {
  expect(UXPinParser.parse(linkTest1)).toStrictEqual([
    {
      order: 0,
      type: 'link',
      text: "Visit UXPin",
      href: 'http://www.uxpin.com',
    }
  ]);
});

//With HREF lacking http part. Also, testing trimming.
const linkTest2 = 'link( Visit UXPin | www.uxpin.com )';

test('Data Test: linkTest2', () => {
  expect(UXPinParser.parse(linkTest2)).toStrictEqual([
    {
      order: 0,
      type: 'link',
      text: "Visit UXPin",
      href: 'http://www.uxpin.com', //Normalized
    }
  ]);
});

//No HREF
const linkTest3 = 'link(Visit UXPin)';

test('Data Test: linkTest3', () => {
  expect(UXPinParser.parse(linkTest3)).toStrictEqual([
    {
      order: 0,
      type: 'link',
      text: "Visit UXPin",
      href: undefined,
    }
  ]);
});

//With HREF - mailto
const linkTest4 = 'link(Contact Us|mailto:support@uxpin.com)';

test('Data Test: linkTest4', () => {
  expect(UXPinParser.parse(linkTest4)).toStrictEqual([
    {
      order: 0,
      type: 'link',
      text: "Contact Us",
      href: 'mailto:support@uxpin.com',
    }
  ]);
});

//with Fluent token
const iconTest1 = 'icon(Globe|themePrimary)';

test('Data Test: iconTest1', () => {
  expect(UXPinParser.parse(iconTest1)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe', //trimmed. otherwise, as entered.
      // color: '#0078d4',  //using UxpColors.getHexFromHexOrToken()
      color: undefined,  //using UxpColors.getHexFromHexOrToken()
      colorToken: 'themePrimary', //as entered, not corrected
      text: "",
    }
  ]);
});

//with hex with hash mark
const iconTest2 = 'icon(Globe|#0078d4)';

test('Data Test: iconTest2', () => {
  expect(UXPinParser.parse(iconTest2)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe',
      color: '#0078d4',
      colorToken: '#0078d4',
      text: "",
    }
  ]);
});

//with hex with no hash mark.
const iconTest3 = 'icon(Globe|0078d4)';

test('Data Test: iconTest3', () => {
  expect(UXPinParser.parse(iconTest3)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe',
      color: '#0078d4',
      colorToken: '0078d4',
      text: "",
    }
  ]);
});

//No color
const iconTest4 = 'icon(Globe)';

test('Data Test: iconTest4', () => {
  expect(UXPinParser.parse(iconTest4)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe',
      color: undefined,
      colorToken: undefined,
      text: "",
    }
  ]);
});

//With the pipe delimiter, but no color spec
const iconTest5 = 'icon(Globe|)';

test('Data Test: iconTest5', () => {
  expect(UXPinParser.parse(iconTest5)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe',
      color: undefined,
      colorToken: undefined,
      text: "",
    }
  ]);
});

//Testing Trimming
const iconTest6 = 'icon( Globe | #0078d4 )';

test('Data Test: iconTest6', () => {
  expect(UXPinParser.parse(iconTest6)).toStrictEqual([
    {
      order: 0,
      type: 'icon',
      iconName: 'Globe',
      color: '#0078d4',
      colorToken: '#0078d4',
      text: "",
    }
  ]);
});

//Plain text
const textTest1 = 'Apples and Grapes';

test('Data Test: textTest1', () => {
  expect(UXPinParser.parse(textTest1)).toStrictEqual([
    {
      order: 0,
      type: 'text',
      text: 'Apples and Grapes',
    }
  ]);
})


//Plain text. Testing the trimming
const textTest2 = '  Apples and Grapes  ';

test('Data Test: textTest2', () => {
  expect(UXPinParser.parse(textTest2)).toStrictEqual([
    {
      order: 0,
      type: 'text',
      text: 'Apples and Grapes',
    }
  ]);
});

//CSV-parseed text escaped because it has a comma in it
const textTest3 = `"I love you, Grapes!"`;

test('Data Test: textTest3', () => {
  expect(UXPinParser.parse(textTest3)).toStrictEqual([
    {
      order: 0,
      type: 'text',
      text: 'I love you, Grapes!',
    }
  ]);
});

//CSV-parsed text with comma in it, no escaping
const textTest4 = 'I love you, Grapes!';

test('Data Test: textTest4', () => {
  expect(UXPinParser.parse(textTest4)).toStrictEqual([
    {
      order: 0,
      type: 'text',
      text: 'I love you',
    },
    {
      order: 1,
      type: 'text',
      text: 'Grapes!',
    }
  ]);
});
