// GoldenLayout configuration with ~20 unique components in a nested/unique layout.
// Import this as `import goldenConfig from './goldenConfig'` and pass to your GoldenLayout constructor.

const goldenConfig = {
  settings: {
    hasHeaders: true,
    reorderEnabled: true,
    selectionEnabled: false,
    suppressPopout: true
  },
  dimensions: {
    headerHeight: 24
  },
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'column',
          width: 40,
          content: [
            { type: 'component', componentName: 'giga', title: 'Navigator' },
            {
              type: 'row',
              height: 60,
              content: [
                { type: 'component', componentName: 'giga', title: 'Inspector' },
                { type: 'component', componentName: 'giga', title: 'Properties' }
              ]
            },
            { type: 'component', componentName: 'giga', title: 'Search' }
          ]
        },
        {
          type: 'column',
          content: [
            {
              type: 'stack',
              content: [
                { type: 'component', componentName: 'giga', title: 'Sheet A' },
                { type: 'component', componentName: 'giga', title: 'Sheet B' },
                { type: 'component', componentName: 'giga', title: 'Sheet C' }
              ]
            },
            {
              type: 'row',
              content: [
                { type: 'component', componentName: 'giga', title: 'Formula Bar' },
                { type: 'component', componentName: 'giga', title: 'Cell Info' }
              ]
            }
          ]
        },
        {
          type: 'column',
          width: 30,
          content: [
            {
              type: 'stack',
              content: [
                { type: 'component', componentName: 'giga', title: 'Chart 1' },
                { type: 'component', componentName: 'giga', title: 'Chart 2' }
              ]
            },
            { type: 'component', componentName: 'giga', title: 'Console' }
          ]
        },
        {
          type: 'column',
          width: 20,
          content: [
            { type: 'component', componentName: 'giga', title: 'Help' },
            {
              type: 'stack',
              content: [
                { type: 'component', componentName: 'giga', title: 'Data' },
                { type: 'component', componentName: 'giga', title: 'Pivot' },
                { type: 'component', componentName: 'giga', title: 'Filters' }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'row',
      isClosable: false,
      height: 20,
      content: [
        { type: 'component', componentName: 'giga', title: 'Status' },
        {
          type: 'stack',
          content: [
            { type: 'component', componentName: 'giga', title: 'Logs' },
            { type: 'component', componentName: 'giga', title: 'Events' }
          ]
        },
        { type: 'component', componentName: 'giga', title: 'Notifications' }
      ]
    }
  ]
};

export default goldenConfig;

// Usage example (in your app code):
// import GoldenLayout from 'golden-layout';
// import goldenConfig from './goldenConfig';
// const layout = new GoldenLayout(goldenConfig, document.getElementById('grid-wrapper'));
// layout.registerComponent('comp1', (container) => { container.getElement().html('<div>Navigator</div>'); });
// ... register other components ...
// layout.init();
