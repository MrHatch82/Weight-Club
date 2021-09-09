Parse.Cloud.define('setStatus', async (request) => {
  const userId = request.params.userId;

  const weightMonthStart = await Parse.Cloud.run('getWeight', {
    userId,
    order: 'asc',
  });

  const weightMonthEnd = await Parse.Cloud.run('getWeight', {
    userId,
    order: 'desc',
  });

  let weightLossMonth = 0;
  if (weightMonthStart) {
    weightLossMonth = weightMonthStart - weightMonthEnd;
  }

  const Status = Parse.Object.extend('Status');
  const status = new Status();
  status.set('userId', userId);
  status.set('weightLossMonth', weightLossMonth);

  try {
    return await status.save();
  } catch (error) {
    console.log('setStatus - Error - ' + error.code + ' ' + error.message);
    return error;
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
