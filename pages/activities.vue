<template>
  <div class="page page-activities container">
    <div class="chat">
      <div class="speaker">
        Maureen<span class="time">15:28</span>
      </div>
      <div class="bubble activity shadow-down">
        <h2>Light Activity: Hiking</h2>
        Went for a 4k hike with the doggos. We got caught in a storm on the way back, so we all returned soaking wet 🙃
      </div>
      <div class="speaker user">
        <span class="time">15:40</span>{{ displayName }}
      </div>
      <div class="bubble shadow-down user">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae odio vitae rem esse optio cupiditate nulla similique ducimus quo nemo. Doloribus fugiat hic, nobis cum repellendus amet dolores quod similique! 🍔🤣
      </div>
      <div class="speaker">
        Bob<span class="time">15:42</span>
      </div>
      <div class="bubble shadow-down">
        Dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="bubble shadow-down">
        Lorem ipsum. 🍆
      </div>
      <div class="day-break">
        <hr>
        <div class="date">
          22.09.21
        </div>
      </div>
      <div class="speaker user">
        <span class="time">17:57</span>{{ displayName }}
      </div>
      <div class="bubble activity shadow-down user">
        <h2>Intense Activity: HIIT Body weight training</h2>
        2x10 Pushups, 2x15 Lying Pullups, 2x20s Planks, 2x25 Lunges.
      </div>
      <div class="speaker">
        Steve<span class="time">18:10</span>
      </div>
      <div class="bubble shadow-down">
        Good job!
      </div>
      <div class="speaker">
        Bob<span class="time">18:11</span>
      </div>
      <div class="bubble shadow-down">
        Yes, well done!
      </div>
    </div>
    <div class="input">
      <b-input placeholder="Enter message..."></b-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    displayName() {
      return this.$store.state.displayName;
    },
  },
};
</script>

<style lang="scss">
.page-activities {
  .chat {
    margin-bottom: 1rem;

    // clearfix
    &::after {
      content: " ";
      display: block;
      height: 0;
      clear: both;
    }
  }

  .day-break {
    padding: 0.5rem 0;
    float: none;
    clear: both;
    position: relative;

    .date {
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -60%);
      color: #6f6f6f;
      background: $dark;
      padding: 0 .5rem;
      line-height: 1;
      font-weight: 300;
      letter-spacing: 0.25px;
      font-size: 12px;
    }
  }

  .speaker {
    margin-bottom: 0.25rem;
    padding: 0 1rem;
    float: left;
    clear: both;
    letter-spacing: 1px;
    font-weight: 600;
    color: $primary;
    font-size: 18px;
    vertical-align: baseline;

    &.user {
      color: $secondary;
    }

    .time {
      color: #6f6f6f;
      font-weight: 300;
      letter-spacing: normal;
      font-size: 12px;
      margin: 0 0.25rem 0.1rem;
    }
  }

  .bubble {
    background: $darker;
    border-radius: 10px 10px 10px 3px;
    max-width: 85%;
    color: $light;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    float: left;
    clear: both;
    letter-spacing: 0.5px;
    font-weight: 400;

    &.user {
      border-radius: 10px 10px 3px 10px;
    }
  }

  .input {
    input {
      font-weight: 500;
    }
  }

  .user {
    float: right;
  }

  .activity {
    color: $secondary;

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      text-transform: uppercase;
      color: $tertiary;
      letter-spacing: 1px;
    }
  }
}
</style>
