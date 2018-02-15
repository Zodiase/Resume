module.exports = {
    firstName: 'Xingchen',
    lastName: 'Hong',
    site: {
        text: 'xc-h.com',
        url: 'https://xc-h.com',
    },
    email: 'hello@xc-h.com',
    phone: '+1 217-419-0746',
    experiences: [
      {
        title: 'Research Developer',
        employer: 'National Center for Supercomputing Applications',
        location: 'Urbana, Illinois, United States',
        startDate: '2015-06',
        endDate: false,
        // Markdown.
        duties:
`
- Proposed and laid the foundation of a new web development toolkit project called Web GIS Components. The project uses advanced web technologies such as Custom Elements and Shadow DOM to provide a suite of reusable components for developing web GIS applications.
- Developed a new prototype web application for the SKOPE project using Meteor and React for more efficient and flexible development process. The web application focuses on visualizing data variations over time.
- Developed data extractor software for a big data management platform of the TerraRef project, extending its the data processing capabilities.
- Took charge in training colleagues about developing Web applications. Prepared a few coding challenges involving using Meteor to build a simple single-page web app with live-updating features and another headless ticketing app with REST APIs. The training uses Git, Webhooks and Continuous Integration to automatically grade submissions. They can be found here: https://goo.gl/fFa5Yz
- Prepared guidelines on web animation design and implementation principles.
- Improved web application deployment and testing process by incorporating Docker containerization.
- Designed and developed a web application called Map Visualizer that can visualize map layers of various data types based on simple config files. The project can be found here: https://goo.gl/TL4vn9
- Worked with researchers on a web GIS app that analyzes and visualizes radiation anomalies from live-streamed geospatial sensor data.
- Led a team developing TopoLens, a web GIS app, using MeteorJS, Openlayers and Material Design Lite, that serves on-demand, reprojected and resampled geographical elevation data. Proposed the high-level architecture of the service that is decentralized and uses message queues and the concept of workers to improve throughput, availability and scalability.
`,
      },
      {
        title: 'Student Developer',
        employer: 'National Center for Supercomputing Applications',
        location: 'Urbana, Illinois, United States',
        startDate: '2014-03',
        endDate: '2015-05',
        // Markdown
        duties:
`
- Designed and implemented a prototype “visual workflow constructor”, using ExtJS and SigmaJS, for DEM infrastructure running on HPC clusters. The workflow constructor takes in available outputs and builds the final workflow based on a complex dependency graph.
- Designed and implemented a new wizard UI for submitting a job request in the TauDEM app. The wizard breaks the entire dynamic form into multiple small stages that are easier to complete and also allows the user to go back to any previous stages.
- Designed and implemented a new UI for the CyberGIS Gateway, an online platform for web GIS applications, using ExtJS.
`,
      },
    ],
};
