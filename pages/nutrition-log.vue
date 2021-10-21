<template>
  <div class="page page-butrutuin-log container">
    <date-picker @dateChanged="dateChanged">
      <div class="col-lg-4 offset-lg-2 mb-4">
        <button class="w-100 btn btn-primary shadow-up" @click="showPopup">
          Add item
        </button>
      </div>
    </date-picker>
  </div>
</template>
