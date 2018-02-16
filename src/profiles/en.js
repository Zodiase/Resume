const {
  Set,
  Map,
  Record,
} = require('immutable');

const SkillKeywordRecord = Record({
  name: '',
  priority: 0,
});

const SkillRecord = Record({
  name: '',
  level: '',
  // @type {Set<SkillKeywordRecord>}
  keywords: Set(),
});

const SkillGroupRecord = Record({
  name: '',
  level: '',
  // @type {Set<SkillRecord>}
  children: Set(),
});

const skillOperations = {
  keywordRegEx: /^(.*?)(?:\^(\d))?$/m,
  /**
   * @param  {string} keywordString
   * @return {SkillKeywordRecord}
   */
  parseKeywordString (keywordString) {
    let skillKeywordRecord = new SkillKeywordRecord();

    const matches = this.keywordRegEx.exec(keywordString);

    skillKeywordRecord = skillKeywordRecord.set('name', matches[1]);

    if (matches[2]) {
      skillKeywordRecord = skillKeywordRecord.set('priority', parseInt(matches[2], 10));
    }

    return skillKeywordRecord;
  },
  /**
   * @return {Set<string>}
   */
  getSkillNameSet () {
    const allKeySet = Set(Object.keys(this));
    const skillNameSet = allKeySet.filter((s) => s[0] !== '_');

    return skillNameSet;
  },
  /**
   * @return {Map<string, SkillRecord>}
   */
  getSkillRecordMap () {
    const skillNameSet = this.getSkillNameSet();
    const skillRecordMap = skillNameSet.reduce((acc, key) => {
      const value = this[key];
      // @type {Array<SkillKeywordRecord>}
      const keywordRecords = value.keywords
      .map(this.parseKeywordString.bind(this));

      return acc.set(
        key,
        new SkillRecord({
          name: key,
          level: value.level,
          keywords: Set(keywordRecords),
        }),
      );
    }, Map());

    return skillRecordMap;
  },
  /**
   * @param  {Array<string>} includes - keywords to include.
   * @param  {Object} options
   * @param  {Array<string>} options.excludes - Keywords to exclude.
   * @return {Set<SkillGroupRecord>}
   */
  pick (includes, options = {}) {
    const {
      excludes = [],
    } = options;

    const includedKeywordStringSet = Set(includes);
    const excludedKeywordStringSet = Set(excludes);

    // @type {Map<string, SkillRecord>}
    const allSkillRecordMap = this.getSkillRecordMap();

    // @type {Map<string, SkillRecord>}
    const pickedSkillRecordMap = allSkillRecordMap
    .filter((skillRecord, skillName) => {
      const skillKeywordRecordSet = skillRecord.keywords;
      const isExcluded = excludedKeywordStringSet.some((keyword) => {
        return skillKeywordRecordSet.some((skillKeywordRecord) => skillKeywordRecord.name === keyword);
      });
      const isIncluded = includedKeywordStringSet.every((keyword) => {
        return skillKeywordRecordSet.some((skillKeywordRecord) => skillKeywordRecord.name === keyword);
      });

      return !isExcluded && isIncluded;
    })
    // Remove keywords in `includes` so they don't affect grouping.
    .mapEntries(([skillName, skillRecord]) => {
      const skillKeywordRecordSet = skillRecord.keywords;
      const remainingSkillKeywordRecordSet = skillKeywordRecordSet.filter((skillKeywordRecord) => !includedKeywordStringSet.contains(skillKeywordRecord.name));
      const newSkillRecord = skillRecord.set('keywords', remainingSkillKeywordRecordSet);

      return [skillName, newSkillRecord];
    });

    const smartGroups = this.smartGroupSkills(pickedSkillRecordMap);

    return smartGroups;
  },
  /**
   * @param  {Map<string, SkillRecord>} skills
   * @return {Set<SkillGroupRecord>}
   */
  smartGroupSkills (skillRecordMap) {
    /**
     * Step 1, find all potential groups by aggregating keywords in every skill.
     * Step 2, for each skill, find the best fit group.
     * Step 3, cleaup empty groups.
     * Step 4, sort remaining groups.
     */
    console.log(skillRecordMap.toJSON());
  },
};

const profile = {
    firstName: 'Xingchen',
    lastName: 'Hong',
    site: {
        text: 'xc-h.com',
        url: 'https://xc-h.com',
    },
    email: 'hello@xc-h.com',
    phone: '+1 217-419-0746',
    skills: {
      'ES6': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Javascript^1',
        ],
      },
      'Node': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Javascript^1',
        ],
      },
      'Meteor': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Web App',
          'Build Tool^1',
          'Javascript',
        ],
      },
      'React': {
        level: 'Proficient',
        keywords: [
          'Web',
          'View^1',
          'Javascript',
        ],
      },
      'jQuery': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Utility^1',
          'Javascript',
        ],
      },
      'Webpack': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Build Tool^1',
          'Javascript',
        ],
      },
      'MongoDB': {
        level: 'Proficient',
        keywords: [
          'Database',
        ],
      },
      'PHP': {
        level: 'Proficient',
        keywords: [
          'Web',
          'Server^1',
        ],
      },
      'MySQL': {
        level: 'Proficient',
        keywords: [
          'Database',
          'Query Language^1',
        ],
      },
      'HTML5': {
        level: 'Proficient',
        keywords: [
          'HTML',
        ],
      },
      'CSS3': {
        level: 'Proficient',
        keywords: [
          'CSS',
        ],
      },
      'LESS': {
        level: 'Proficient',
        keywords: [
          'CSS',
        ],
      },
      'SASS': {
        level: 'Proficient',
        keywords: [
          'CSS',
        ],
      },
      'ExtJs': {
        level: 'Proficient',
        keywords: [
          'Web',
          'View^1',
          'Javascript',
        ],
      },
      'Docker': {
        level: 'Proficient',
        keywords: [
          'Containerization',
          'Virtualization',
        ],
      },
      'Travis-CI': {
        level: 'Proficient',
        keywords: [
          'Continuous Integration',
        ],
      },
      'Mocha': {
        level: 'Proficient',
        keywords: [
          'Testing',
          'Test Runner^1',
        ],
      },
      'Chai': {
        level: 'Proficient',
        keywords: [
          'Testing',
          'Assertion Library^1',
          'Javascript',
        ],
      },
      'PhantomJS': {
        level: 'Knowledgeable',
        keywords: [
          'Testing',
          'Headless Browser^1',
          'Javascript',
        ],
      },
      'Cpp': {
        level: 'Proficient',
        keywords: [
          'C',
          'Object Oriented Programming',
          'Software Programming',
          'Native Programming',
        ],
      },
      'Git': {
        level: 'Proficient',
        keywords: [
          'Version Control',
        ],
      },
      'SVN': {
        level: 'Proficient',
        keywords: [
          'Version Control',
        ],
      },
      'Csharp': {
        level: 'Knowledgeable',
        keywords: [
          'C',
          'Object Oriented Programming',
          'Software Programming',
          'Native Programming',
        ],
      },
      'Objective-C': {
        level: 'Knowledgeable',
        keywords: [
          'C',
          'Object Oriented Programming',
          'Software Programming',
          'Native Programming',
        ],
      },
      'Basic': {
        level: 'Knowledgeable',
        keywords: [
          'Object Oriented Programming',
          'Software Programming',
          'Native Programming',
        ],
      },
      'OpenMP': {
        level: 'Knowledgeable',
        keywords: [
          'Parallel Programming',
          'Parallelization',
        ],
      },
      'MPI': {
        level: 'Knowledgeable',
        keywords: [
          'Parallel Programming',
          'Parallelization',
        ],
      },
      'Unity3D': {
        level: 'Knowledgeable',
        keywords: [
          'Game Development',
          'Game Engine',
        ],
      },
      '_remarks': [
        {
          markdown:
`
- 10+ years (since 2007) of working experience in website web application development. 
- Proficient in web designing and prototyping with Adobe Photoshop and Adobe Illustrator.
`,
          scope: [
            'Web',
          ],
        },
      ],
    },
    experiences: [
      {
        title: 'Research Developer',
        employer: 'National Center for Supercomputing Applications',
        location: 'Urbana, Illinois, United States',
        startDate: '2015-06',
        endDate: false,
        // Markdown.
        dutyRemarks:
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
        dutyRemarks:
`
- Designed and implemented a prototype “visual workflow constructor”, using ExtJS and SigmaJS, for DEM infrastructure running on HPC clusters. The workflow constructor takes in available outputs and builds the final workflow based on a complex dependency graph.
- Designed and implemented a new wizard UI for submitting a job request in the TauDEM app. The wizard breaks the entire dynamic form into multiple small stages that are easier to complete and also allows the user to go back to any previous stages.
- Designed and implemented a new UI for the CyberGIS Gateway, an online platform for web GIS applications, using ExtJS.
`,
      },
    ],
};

Object.setPrototypeOf(profile.skills, skillOperations);

module.exports = profile;
