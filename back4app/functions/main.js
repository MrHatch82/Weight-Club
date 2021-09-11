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

  const statusObject = await Parse.Cloud.run('getStatus', { userId });

  let weightLossMonth = 0;
  let weightLossTotal = 0;
  let weightRemaining = 0;
  let weightPercent = 0;
  if (weightMonthStart) {
    weightLossMonth = weightMonthStart - weightMonthEnd;
    weightLossTotal = userSettings.weightStart - weightMonthEnd;
    weightRemaining = weightMonthEnd - userSettings.weightGoal;
    weightPercent =
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
  status.set('weightPercent', weightPercent);
  status.set('weightCurrent', weightMonthEnd);
  status.set('displayName', userSettings.displayName);

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
  query.equalTo('userID', userId);
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
