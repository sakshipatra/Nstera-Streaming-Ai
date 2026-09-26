const { Media, memoryMedia } = require('../models/Media');
const { getIsConnected } = require('../config/db');

const initialMediaCatalog = [
  {
    id: 'm1',
    title: 'SHADOW PROTOCOL',
    type: 'movie',
    year: 2026,
    rating: 'TV-MA',
    duration: '2h 18m',
    matchScore: '99% Match',
    badge: 'TOP 1 TODAY',
    tags: ['Sci-Fi', 'Action', 'Cyberpunk', 'High-Octane'],
    description: 'A rogue operative in neon rain-slicked cyberpunk alleyways fights to uncover a suppressed global conspiracy that threatens human consciousness.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAUtBVURf3OiPqWnc0igR3hqnlSeYLEmavAL48oRf9aV2U5HrMREStnCnKHaQC-_T5-2EoROC1egCTVGWM5fBMGJfrwUOJyClRvukKK1yC9r5ZRA0Hcd73Oq5gt_1Ln0iL1IgfQ9_FBbY1BzBU8LdldvkjdoDeKgvdlmmbG_rPamhCbP_lWfiEEg81E4oE6D85CTtZaDSV6Fcr117RSdRqs6j9QWDPNHUlA4auqdjUDQu6l_yU4EfukQ',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5b8iRXWQso2k5nmco0LBRke1uG7lBREdHBMnV6DNs5a53wU1WU6n5O6HeG4OqYDKNqorPpX3tZ9Huse9nfmsgj1gjc8NU18GtMr2OhNRP3-wqEE5X2qPRd0FQHagfw1gWF3kadMpJazX-ZbFNXv-5NLBUdMfDnnlUED6TCK9FGU9-GTUdd2S52ZEGKDiHgCzWhLbeO0nZKrqQU7MU_fIJd42kuwpKlVrhgroSQFWntKFnGzsVEjllug',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Elena Rostova', 'Marcus Vance', 'Kaito Tanaka'],
    director: 'Denis Villeneuve',
    category: 'Sci-Fi',
    isOriginal: true,
    isTrending: true
  },
  {
    id: 's1',
    title: 'STRANGER DIMENSIONS',
    type: 'series',
    year: 2026,
    rating: 'TV-14',
    duration: '3 Seasons',
    matchScore: '97% Match',
    badge: 'NEW SEASON',
    tags: ['Sci-Fi', 'Mystery', 'Supernatural'],
    description: 'When a mysterious anomaly fractures time in a small coastal town, a group of investigators discovers alternate realities bleeding into ours.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_A2gTTggPTLr1UK1N3F6dqOjiVsc5nRyYa9YOCd49MXrOTfLpy688LIIy-jA6cHcyJTlEzD6yoC3hu4H_KgPBr_WVdmPluW1R7f9vCqjCDcl-jGC1q918PZWt7TVdOMqVChi5nG68l6-i90GfU7CYtGoVDHfeU67hjzZKPAGYbdqNIMcxXXAueuwW5x2Yyytcq8Slf6AObfV2hGMUN8pYiuzDfQJtLZZgJx160R01S4I0aaBSvqt7wQ',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU4kDlGj7NltbDG36a8KQXQ6JCo5Q50zzxj_vtReT-2EmHlPRjSnoJCU7nM8MlQEuu2RRXCaZ-LK2uwvJTmbXI8dLTsfEhyUeCxfsFS-mfmc13lXghakz-_RuiFHH646GLYp536ha4Fj5ky5-JVNlkOQbFccGtqdkEkVkvOo7t-0WUpn61GZz7CgZz6Ntk5jO3RknIZL0UdR8rXH5msPv5jMHm403mcy5JHqp_fuiqMYkUWgVmkBu_XA',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Maya Lin', 'David Thorne', 'Sophie Miller'],
    director: 'The Duffer Brothers',
    seasonsCount: 3,
    episodes: [
      {
        id: 's1e1',
        number: 1,
        title: 'Episode 1: The Breach',
        duration: '52m',
        synopsis: 'A strange seismic distortion disturbs a quiet observatory. Dr. Lin registers impossible sub-space frequencies.',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBstNs6TX4KXHss8lQK2qwznxeoutCew1G5RXvzR_RSEP9ngPOa5SkPph9r5J5GYiQ3rfznm9nIen-22ThWzOIw8GUuGM8MchhtwHMQqzG7BLzkl_eD0Sq7z7t7V9GWTcr7g-oDHHlO0OaQThX5UKFLei0U4eQsxIukB6Y1cc5p4K4Yk2A8XLoMHx78MTOYm3X-aAxKg0dbELSjgHqf_WbnIhA_Qa0cdRPTE2al-uzOLTcJ_2qySXOMgQ',
        progress: 80
      },
      {
        id: 's1e2',
        number: 2,
        title: 'Episode 2: Echoes in the Dark',
        duration: '48m',
        synopsis: 'The team follows a signal into the decommissioned subterranean sector, encountering phantom projections.',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNTYtYLuz0YmKknEeqy08JPVtvhE39EDtxILSxknr4zZ3mTUmK4wJ-9D1-EVtdgw_ADwlOANG1HeNA1J66E6ZUAmz_4x8kJATssoAZifL1no9L73B7Lj5HJWaV6knBdgfbtuTGxMbepOi0o8jS6G5vXIHyb8O6uM1hVyTyIOhS7kqk_f7B-Bx-UOW7o-aTZkLjC4fNh6ieaZCZm-jaD8E5DmojveuGHbPM4aER9egD3ecFx9KnBWHH-Q',
        progress: 25
      },
      {
        id: 's1e3',
        number: 3,
        title: 'Episode 3: Singularity Signal',
        duration: '55m',
        synopsis: 'A high stakes confrontation at the power grid forces the crew to make a terrible choice.',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2IF7lMh_GIG48G_ey1O8bfjBahEz7JfEjdnnwiZN8U2CM_dtRJj2-0XipLLYLRvs29VPZPYyuuWfMZAa7Qs6S9b6EJgGcJK4EzUXG4xkVC6hPmePiBkkB_Lly8Jtg998bkNLiJsabc6l2YEcF9ESZ1WzZkTcWRbopeX3etiGYuvpvgPqE0mgFh0Ha_U-qOLmgyU7h-NsXu8KTNBRZ9_HQmLdkiFmqJZmJ6qUa_eSobHr6oFSRJkHanw',
        progress: 0
      }
    ],
    category: 'Series',
    isOriginal: true,
    isTrending: true
  },
  {
    id: 'm2',
    title: 'REDLINE VELOCITY',
    type: 'movie',
    year: 2026,
    rating: 'PG-13',
    duration: '1h 55m',
    matchScore: '95% Match',
    badge: '4K ULTRA HD',
    tags: ['Action', 'Cars', 'Thriller'],
    description: 'High stakes illegal night racing through neon metropolis streets with motion blurred supercars under dramatic red taillight flares.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkwBQt4Xfqwl3jVLexTcjdfdIqLoUcf9u4BGqPPPn3okufijviYgY9SBO5MZLSMA8x6_Z-pIc5yMPxBrY__YJJsIqJ-X2tmWdymz80eBpjo9kaqCygxr3zLGSIrizUi9zPpqPK0vBhoNPp3dPAqWZ-MXGHLBvPgsaGk5mPNGFgNW97K7jagZU5pcxZTHkBMbyHYK24m9WGgl1dwprJAD2HCVregl8qcQAgvlQe4T7J8FTDKjV1m1Xg2A',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkwBQt4Xfqwl3jVLexTcjdfdIqLoUcf9u4BGqPPPn3okufijviYgY9SBO5MZLSMA8x6_Z-pIc5yMPxBrY__YJJsIqJ-X2tmWdymz80eBpjo9kaqCygxr3zLGSIrizUi9zPpqPK0vBhoNPp3dPAqWZ-MXGHLBvPgsaGk5mPNGFgNW97K7jagZU5pcxZTHkBMbyHYK24m9WGgl1dwprJAD2HCVregl8qcQAgvlQe4T7J8FTDKjV1m1Xg2A',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Dominic Torg', 'Letty Ortiz', 'Brian O’Conner'],
    director: 'Justin Lin',
    category: 'Action',
    isOriginal: false,
    isTrending: true
  },
  {
    id: 'm3',
    title: 'MIND HUNTERS: DEEP STATE',
    type: 'movie',
    year: 2025,
    rating: 'TV-MA',
    duration: '2h 05m',
    matchScore: '96% Match',
    badge: 'MUST WATCH',
    tags: ['Crime', 'Thriller', 'Noir'],
    description: 'A dark noir crime thriller following a shadow detective traversing wet rainy urban alleys to hunt down an elite Syndicate.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc8xTLCH0CO-UJGJzB1vmoEDvW0W9fR_aCz6hHIVYIAWSxBbhCrAOVtrAcztAGakgkLIiOsssRfk8AmodzICForaETlTIIfrJfVNdyMlVHvrA-Adsic1wYDdMuvyc0OT6F7_oPtsBXAABmkMAZORQuN23vL-DwYawRaOK99Qdi8EJgoWU4rguMXnIftQO_XTf07G130TrWkRxXlqTFwivLPqj9ekREZUvtNL4KCGVUuE3EAa5SlMDC_w',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc8xTLCH0CO-UJGJzB1vmoEDvW0W9fR_aCz6hHIVYIAWSxBbhCrAOVtrAcztAGakgkLIiOsssRfk8AmodzICForaETlTIIfrJfVNdyMlVHvrA-Adsic1wYDdMuvyc0OT6F7_oPtsBXAABmkMAZORQuN23vL-DwYawRaOK99Qdi8EJgoWU4rguMXnIftQO_XTf07G130TrWkRxXlqTFwivLPqj9ekREZUvtNL4KCGVUuE3EAa5SlMDC_w',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    cast: ['Holden Ford', 'Bill Tench', 'Dr. Wendy Carr'],
    director: 'David Fincher',
    category: 'Crime',
    isOriginal: true,
    isTrending: true
  },
  {
    id: 'm4',
    title: 'ABYSS RIFT',
    type: 'movie',
    year: 2026,
    rating: 'PG-13',
    duration: '2h 10m',
    matchScore: '92% Match',
    badge: 'HDR10+',
    tags: ['Sci-Fi', 'Underwater', 'Adventure'],
    description: 'Atmospheric deep sea submarine exploration in pitch-black ocean trenches plagued by striking crimson warning beacons and unknown leviathans.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu6-wb_Wk0bfTmWY3pu8IyNMf-7sfQCjxX1dcRILrs4UUI1vmQ194EhjCv2hnEpZ4JlNheFRQvacoNvYlP7cWvjaUq0izX2eKaBY-D1gGCsIkKYCflU_rlwAzixUsxluO240gdLu_lKXbPHxgrKIOQsPb3Dwe4srtl45vVUyawRejkz_Dt6WD3VqhK4UE4kYxoqTLFHGq3NDGBt9y6v0ozzuj-OgupiaLIZ70QYyFdLfhDWXKGrEo0_w',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu6-wb_Wk0bfTmWY3pu8IyNMf-7sfQCjxX1dcRILrs4UUI1vmQ194EhjCv2hnEpZ4JlNheFRQvacoNvYlP7cWvjaUq0izX2eKaBY-D1gGCsIkKYCflU_rlwAzixUsxluO240gdLu_lKXbPHxgrKIOQsPb3Dwe4srtl45vVUyawRejkz_Dt6WD3VqhK4UE4kYxoqTLFHGq3NDGBt9y6v0ozzuj-OgupiaLIZ70QYyFdLfhDWXKGrEo0_w',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    cast: ['James Cameron', 'Ed Harris', 'Mary Elizabeth'],
    director: 'James Cameron',
    category: 'Sci-Fi',
    isOriginal: false,
    isTrending: false
  },
  {
    id: 's2',
    title: 'CYBER CHRONICLES',
    type: 'series',
    year: 2026,
    rating: 'TV-MA',
    duration: '2 Seasons',
    matchScore: '94% Match',
    badge: 'POPULAR',
    tags: ['Sci-Fi', 'Dystopian', 'Animation'],
    description: 'Intense dystopian rebellion sci-fi key art with towering brutalist architecture under deep eclipse shadows.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWrmmc8hRCh1bcQrnsfkHF-ZFzt6qqf0a2rrYTZnnIGQHERCTaYJGc_xxnb-6Q8g7ZQoNTyGK2v5NTIJb4pbi807Eu4rwAhpGtX0K40TRfUztpFc_KztsCeidBgx3kkR_ALMIr35vJPin74xs5CN9xWj1v5L35R4H6y25C0WjH2eBoQSVGUgnkPqnv_JCCFbd8sL80YNndwK6hZYIMeu3Utl2HshQOY41H54ylsJVdNd8Q1ZNqbYwSvA',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWrmmc8hRCh1bcQrnsfkHF-ZFzt6qqf0a2rrYTZnnIGQHERCTaYJGc_xxnb-6Q8g7ZQoNTyGK2v5NTIJb4pbi807Eu4rwAhpGtX0K40TRfUztpFc_KztsCeidBgx3kkR_ALMIr35vJPin74xs5CN9xWj1v5L35R4H6y25C0WjH2eBoQSVGUgnkPqnv_JCCFbd8sL80YNndwK6hZYIMeu3Utl2HshQOY41H54ylsJVdNd8Q1ZNqbYwSvA',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    cast: ['David Martinez', 'Lucy Kushinada', 'Maine'],
    director: 'Hiroyuki Imaishi',
    seasonsCount: 2,
    category: 'Series',
    isOriginal: true,
    isTrending: true
  }
];

const seedCatalog = async () => {
  // Populate in-memory catalog
  memoryMedia.length = 0;
  memoryMedia.push(...initialMediaCatalog);

  // If Mongo DB is connected, seed Mongo collection
  if (getIsConnected()) {
    try {
      const count = await Media.countDocuments();
      if (count === 0) {
        await Media.insertMany(initialMediaCatalog);
        console.log('[Seed] Database seeded with initial media catalog.');
      }
    } catch (err) {
      console.error('[Seed Error]', err.message);
    }
  }
};

module.exports = { seedCatalog, initialMediaCatalog };
