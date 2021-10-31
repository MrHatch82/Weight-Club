Parse.Cloud.define('setStatus', async (request) => {
  const userId = request.params.userId;
  const { userSettings } = request.params;

  const weightMonthStart = await Parse.Cloud.run('getWeight', {
    userId,
    order: 'asc',
  });

  const weightMonthEnd = await Parse.Cloud.run('getWeight', {
    userId,
    order: 'desc',
  });

  const exercises = await Parse.Cloud.run('getExercises', {
    userId,
  });

  const statusObject = await Parse.Cloud.run('getStatus', { userId });

  let weightLossMonth = 0;
  let weightLossTotal = 0;
  let weightRemaining = 0;
  let weightLossPercent = 0;
  if (weightMonthStart) {
    weightLossMonth = weightMonthStart - weightMonthEnd;
    weightLossTotal = userSettings.weightStart - weightMonthEnd;
    weightRemaining = weightMonthEnd - userSettings.weightGoal;
    weightLossPercent =
      (100 / (userSettings.weightStart - userSettings.weightGoal)) *
      weightLossTotal;
  }

  const Status = Parse.Object.extend('Status');
  let status = new Status();
  if (statusObject) {
    status = statusObject;
  }
  status.set('userId', userId);
  status.set('weightLossMonth', weightLossMonth);
  status.set('weightLossTotal', weightLossTotal);
  status.set('weightRemaining', weightRemaining);
  status.set('weightLossPercent', weightLossPercent);
  status.set('weightCurrent', weightMonthEnd);
  status.set('exercisesLight', exercises.light);
  status.set('exercisesHeavy', exercises.intense);
  status.set('exercises', exercises.exercises);

  try {
    return await status.save();
  } catch (error) {
    console.log('setStatus - Error - ' + error.code + ' ' + error.message);
    return error;
  }
});

Parse.Cloud.define('getStatus', async (request) => {
  const userId = request.params.userId;
  const Status = Parse.Object.extend('Status');
  const query = new Parse.Query(Status);
  query.equalTo('userId', userId);
  try {
    const object = await query.first();
    return object || null;
  } catch (error) {
    console.error('Error while fetching Status', error);
  }
});

Parse.Cloud.define('getExercises', async (request) => {
  const userId = request.params.userId;

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 0);

  const Messages = Parse.Object.extend('Messages');

  const queryLight = new Parse.Query(Messages);
  queryLight.equalTo('userId', userId);
  queryLight.greaterThanOrEqualTo('createdAt', firstDay);
  queryLight.lessThanOrEqualTo('createdAt', date);
  queryLight.equalTo('exerciseLight', true);

  const queryIntense = new Parse.Query(Messages);
  queryIntense.equalTo('userId', userId);
  queryIntense.greaterThanOrEqualTo('createdAt', firstDay);
  queryIntense.lessThanOrEqualTo('createdAt', date);
  queryIntense.equalTo('exerciseHeavy', true);

  const queryMain = Parse.Query.or(queryLight, queryIntense);

  try {
    const results = await queryMain.find();

    const days = [];
    const month = new Date().getMonth();
    const firstDay = new Date(new Date().getFullYear(), month, 1);

    while (firstDay.getMonth() === month) {
      const exerciseLight = false;
      const exerciseHeavy = false;
      days.push({
        date: new Date(firstDay.getTime()),
        exerciseLight,
        exerciseHeavy,
      });
      firstDay.setDate(firstDay.getDate() + 1);
    }

    const exercisesLight = [];
    const exercisesHeavy = [];

    for (const object of results) {
      if (object.get('exerciseLight')) {
        const dateString = `${object.get('date')}`;
        const dayIndex = parseInt(dateString.substring('6'), 10) - 1;
        if (!exercisesLight.includes(dateString)) {
          exercisesLight.push(dateString);
          days[dayIndex].exerciseLight = true;
        }
      }
      if (object.get('exerciseHeavy')) {
        const dateString = `${object.get('date')}`;
        const dayIndex = parseInt(dateString.substring('6'), 10) - 1;
        if (!exercisesHeavy.includes(dateString)) {
          exercisesHeavy.push(dateString);
          days[dayIndex].exerciseHeavy = true;
        }
      }
    }

    return {
      light: exercisesLight.length,
      intense: exercisesHeavy.length,
      exercises: days,
    };
  } catch (error) {
    console.error('Error while fetching Weights', error);
  }
});

Parse.Cloud.define('getWeight', async (request) => {
  const userId = request.params.userId;
  const order = request.params.order;

  const date = new Date();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = `${lastDay.getFullYear()}`;
  const month =
    lastDay.getMonth() + 1 < 10
      ? `0${lastDay.getMonth() + 1}`
      : `${lastDay.getMonth() + 1}`;
  const day =
    lastDay.getDate() < 10 ? `0${lastDay.getDate()}` : `${lastDay.getDate()}`;
  const firstDayInt = parseInt(`${year}${month}01`, 10);
  const lastDayInt = parseInt(`${year}${month}${day}`, 10);

  const Weights = Parse.Object.extend('Weights');
  const query = new Parse.Query(Weights);
  query.equalTo('userId', userId);
  query.greaterThanOrEqualTo('date', firstDayInt);
  query.lessThanOrEqualTo('date', lastDayInt);
  if (order === 'asc') {
    query.ascending('date');
  } else {
    query.descending('date');
  }

  try {
    const object = await query.first();
    const weight = object.get('weight');
    return weight;
  } catch (error) {
    console.error('Error while fetching Weights', error);
  }
});

Parse.Cloud.define('signUp', async (request) => {
  const username = request.params.username;
  const password = request.params.password;
  const alphaPass = request.params.alphaPass;

  if (alphaPass === 'Penis123!') {
    const User = new Parse.User();
    const query = new Parse.Query(User);
    query.equalTo('username', username);

    try {
      const user = await query.first();

      if (user) {
        console.log('Username taken');
        return { error: 'Username taken!' };
      } else {
        const newUser = new Parse.User();
        newUser.set('username', username);
        newUser.set('password', password);

        try {
          const userResult = await user.signUp();
          console.log('User signed up', userResult);
          return { success: 'User signed up' };
        } catch (error) {
          console.error('Error while signing up user', error);
        }
      }
    } catch (error) {
      console.error('Error while fetching user', error);
    }
  } else {
    console.error('Wrong Alpha Pass');
    return { error: 'Wrong Alpha Pass!' };
  }
});
