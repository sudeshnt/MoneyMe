export class Config {

  // App constants
  public static timeOffset = 5.5;

  public static pageSize = 20;

  public static infiniteScrollThreshold = '10%';

  public static LANGUAGES = {
    "SINHALA" : {
      "code":"si",
      "name":'සිංහල'
    },
    "ENGLISH" : {
      "code":"en",
      "name":'English'
    },
    "TAMIL" : {
      "code":"ta",
      "name":'தமிழ்'
    }
  };

  public static IMAGE_QUALITY = {
    "DOCUMENT" : 50
  };

  public static MEETING_DURATION = {
    "MIN" : {
      "H":9,
      "M":0
    },
    "MAX" : {
      "H":17,
      "M":59
    }
  };

  public static MEETING_OCCASIONS = [
    {
      'id': 1,
      'name': 'ASAP'
    },
    {
      'id': 2,
      'name': 'Today morning (after 8am)',
      'maxTime': {
          'hours' : 11,
          'minutes' : 30
      }
    },
    {
      'id': 3,
      'name': 'Today lunch time (12:30-2:30pm)',
      'maxTime': {
        'hours' : 13,
        'minutes' : 30
      }
    },
    {
      'id': 4,
      'name': 'Today afternoon (2:30-5:30pm)',
      'maxTime': {
        'hours' : 16,
        'minutes' : 30
      }
    },
    {
      'id': 5,
      'name': 'Tomorrow morning (after 8am)'
    },
    {
      'id': 6,
      'name': 'Tomorrow lunch time (12:30-2:30pm)'
    },
    {
      'id': 7,
      'name': 'Tomorrow afternoon (2:30-5:30pm)'
    },
    {
      'id': 8,
      'name': 'After tomorrow and within 5 days'
    }
  ]
}
