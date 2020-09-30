const getEditorial = index => ({
  id: `${index}GLOBAL_LY0009243260`,
  title: 'Girls S502 (M18)',
  images: [
    {
      fileUrl: 'https://poster.starhubgo.com/poster/HBO_GirlsS5.jpg',
      __typename: 'AccedoImage'
    }
  ],
  action: 'Editorial'
});

export const getTvShow = index => ({
  id: `${index}666750`,
  title: 'Dragonheart: Vengeance',
  categories: [
    {
      title: 'Fantasy',
      __typename: 'Genre'
    }
  ],
  images: [
    {
      fileUrl:
        'https://image.tmdb.org/t/p/w342///qZ1KAgfdeNbzrNYKW4BIRHdEBJ9.jpg',
      __typename: 'AccedoImage'
    }
  ],
  premium: true,
  action: 'TheMoviesDbMovie'
});

const editorials = Array(40)
  .fill()
  .map((_, index) => getEditorial(index));

const tvItems = Array(10)
  .fill()
  .map((_, index) => getTvShow(index));

const list = [68, 69, 70, 71, 72, 73, 74, 89, 98].map(val => getTvShow(val));

export const tvShows = [...tvItems, ...list];

export const moviesData = [
  {
    id: '419704',
    title: 'Ad Astra',
    categories: [
      {
        title: 'Adventure',
        __typename: 'Genre'
      },
      {
        title: 'Drama',
        __typename: 'Genre'
      }
    ],
    images: [
      {
        fileUrl:
          'https://image.tmdb.org/t/p/w342///xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg',
        __typename: 'AccedoImage'
      }
    ],
    action: 'TheMoviesDbMovie'
  },
  {
    id: '512200',
    title: 'Jumanji: The Next Level',
    categories: [
      {
        title: 'Action',
        __typename: 'Genre'
      },
      {
        title: 'Adventure',
        __typename: 'Genre'
      }
    ],
    images: [
      {
        fileUrl:
          'https://image.tmdb.org/t/p/w342///bB42KDdfWkOvmzmYkmK58ZlCa9P.jpg',
        __typename: 'AccedoImage'
      }
    ],
    action: 'TheMoviesDbMovie'
  },
  {
    id: '666750',
    title: 'Dragonheart: Vengeance',
    categories: [
      {
        title: 'Fantasy',
        __typename: 'Genre'
      }
    ],
    images: [
      {
        fileUrl:
          'https://image.tmdb.org/t/p/w342///qZ1KAgfdeNbzrNYKW4BIRHdEBJ9.jpg',
        __typename: 'AccedoImage'
      }
    ],
    action: 'TheMoviesDbMovie'
  },
  {
    id: '495764',
    title:
      'Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)',
    categories: [
      {
        title: 'Action',
        __typename: 'Genre'
      },
      {
        title: 'Comedy',
        __typename: 'Genre'
      }
    ],
    images: [
      {
        fileUrl:
          'https://image.tmdb.org/t/p/w342///h4VB6m0RwcicVEZvzftYZyKXs6K.jpg',
        __typename: 'AccedoImage'
      }
    ],
    action: 'TheMoviesDbMovie'
  }
];

export const TV_ITEM = {
  displayText: 'TV',
  title: 'tv',
  page: 'tv',
  requireauthentication: null,
  pageData: {
    template: 'landing',
    displayText: 'tv',
    title: 'tv',
    containers: [
      {
        template: 'carousel',
        displayText: null,
        cardType: 'featured',
        rail: { items: moviesData },
        title: 'Hero Banner (themoviesdb)',
        _meta: {
          id: '5e3bb5fe23eec6001db5e4ab',
          __typename: 'Meta'
        },
        __typename: 'Container'
      },
      {
        template: 'carousel',
        displayText: 'Now on TV',
        cardType: '16x9',
        rail: { items: tvShows },
        title: 'First Rail',
        _meta: {
          id: '5df99f2023eec6001ba1e65f',
          __typename: 'Meta'
        },
        __typename: 'Container'
      },
      {
        template: 'carousel',
        displayText: 'Favourite Channels',
        cardType: '2x3',
        rail: { items: editorials },
        title: 'Nagra: Favourite Channels',
        _meta: {
          id: '5e4d51d7a0e845001c5a148e',
          __typename: 'Meta'
        },
        __typename: 'Container'
      }
    ],
    __typename: 'Page'
  },
  __typename: 'Menu',
  menuItems: [
    {
      displayText: 'Shows',
      subText: '',
      to: 'all movies',
      icon: '',
      items: []
    },
    {
      displayText: 'Series',
      subText: '',
      to: 'comedy',
      icon: '',
      items: []
    },
    {
      displayText: 'Kids',
      subText: '',
      to: 'drama',
      icon: '',
      items: []
    }
  ]
};
