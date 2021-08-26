<template>
  <div class="container text-center pt-5">
    <div>
      <p>
        <span class="fat">{{ total }} kg</span><br />
        of fat collectively<br />
        eradicated this month!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: 'Peter',
            data: [130, 129, 129, 128, 127, null],
            borderColor: 'rgb(255, 0, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          },
          {
            label: 'Paul',
            data: [122, 123, 123, null, 122, 121],
            borderColor: 'rgb(255, 255, 0)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          },
          {
            label: 'Mary',
            data: [112, 112, null, 112, 113, 113],
            borderColor: 'rgb(0, 255, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          }
        ]
      }
    }
  },
  computed: {
    total() {
      let total = 0

      this.chart.datasets.forEach((dataset) => {
        let lastWeight = null
        let difference = 0

        dataset.data.forEach((weight, index) => {
          if (weight !== null && index > 0) {
            difference += lastWeight - weight
          }
          lastWeight = weight || lastWeight
        })

        total += difference
      })

      return total
    }
  },
  mounted() {
    this.$parse.initialize()
    this.$parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
    // Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
    this.$parse.initialize(
      'gkNock8bO0VYjSlEhS2gmsOqyr9eSq35GcOWBrGU', // This is your Application ID
      'ArOZ0ctTLLaLhhshVjueU4eG5QW8QrBxnWvr9Ua1', // This is your Javascript key
      '8dkxqdjHShlVAabpAJDBbAO3h9cGmst0s5Yk4H5s' // This is your Master key (never use it in the frontend)
    )
    this.login()
  },
  methods: {
    async login() {
      try {
        // Pass the username and password to logIn function
        const user = await this.$parse.User.logIn('MrHatch', 'fatchance')
        // Do stuff after successful login
        console.log('Logged in user', user)
        this.getWeights()
      } catch (error) {
        console.error('Error while logging in user', error)
      }
    },
    async getWeights() {
      const Weights = this.$parse.Object.extend('Weights')
      const query = new this.$parse.Query(Weights)
      // You can also query by using a parameter of an object
      // query.equalTo('objectId', 'xKue915KBG');
      // const results = await query.find()
      try {
        const results = await query.find()
        for (const object of results) {
          // Access the Parse Object attributes using the .GET method
          const date = object.get('date')
          const weight = object.get('weight')
          const userID = object.get('userID')
          console.log(date)
          console.log(weight)
          console.log(userID)
        }
      } catch (error) {
        console.error('Error while fetching Weights', error)
      }
    }
  }
}
</script>

<style lang='scss'>
.fat {
  font-size: 24px;
  font-weight: 600;
}
</style>
