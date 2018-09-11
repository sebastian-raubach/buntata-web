<template>
  <div>
    <div class="header-container">
      <h2>About</h2>
      <p>Buntata is an app which aids in the identification of plant disease and pathogens and offers information to
		farmers where they can go to get more details about any pests. It provides downloadable datasets allowing users to use the application in the
		field without the need of a mobile signal.</p><p>This first release focusses on potato pests and diseases, but Buntata can easily be adapted for any crop system.</p><p>We would welcome comments, feedback and contributions to this data resource. Feel free to contact us using any of the methods below.</p>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" v-on:click="open('https://play.google.com/store/apps/details?id=uk.ac.hutton.ics.buntata', true)">
        <mdi-google-play-icon/>
        Google Play
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" v-on:click="open('https://ics.hutton.ac.uk/get-buntata', true)">
        <mdi-earth-icon/>
        Website
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" v-on:click="open('mailto:cropgeeksapps@hutton.ac.uk')">
        <mdi-email-icon/>
        Email
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" v-on:click="open('https://twitter.com/BuntataApp', true)">
        <mdi-twitter-icon/>
        Twitter
      </button>
      <h3>Team</h3>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp" v-for="dev in devs" :key="dev.name">
        <div class="mdl-card__media" :style="{ backgroundImage: 'url(\'' + dev.img + '\')' }"></div>
        <div class="mdl-card__title">
          <h4 class="mdl-card__title-text">{{ dev.name }}</h4>
          <a class="mdl-button mdl-button--fab mdl-button--colored mdl-shadow--6dp" :href="'mailto:' + dev.email"><i class="material-icons">email</i></a>
        </div>
        <div class="mdl-card__supporting-text">
          <p v-if="dev.title">{{ dev.title }}</p>
          <p v-if="dev.institution && dev.institution.group">{{ dev.institution.group }}</p>
          <p v-if="dev.institution && dev.institution.name">{{ dev.institution.name }}</p>
        </div>
      </div>
    </div>
    <div class="header-container">
      <h3>Acknowledgements</h3>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone acknowledgement" v-for="ack in acknowledgements" :key="ack.name">
        <div class="logo" :style="{ backgroundImage: 'url(\'' + ack.logo + '\')' }"></div>
        <div class="mdl-card__title">
          <h4 class="mdl-card__title-text">{{ ack.name }}</h4>
        </div>
      </div>
    </div>
    <div id='banner' />
  </div>
</template>

<script>
  require('mdi-vue/GooglePlayIcon')
  require('mdi-vue/EarthIcon')
  require('mdi-vue/EmailIcon')
  require('mdi-vue/TwitterIcon')

  require('../assets/js/hutton-banner.js')
  require('../assets/css/hutton-banner.css')

  export default {
    data: function () {
      return {
        devs: [
          {
            name: 'Sebastian Raubach',
            title: 'Bioinformatics Software Developer',
            email: 'sebastian.raubach@hutton.ac.uk',
            institution: {
              group: 'Information & Computational Sciences',
              name: 'The James Hutton Institute'
            },
            img: './static/img/sebastian-raubach.jpg'
          },
          {
            name: 'Paul Shaw',
            title: 'Bioinformatician',
            email: 'paul.shaw@hutton.ac.uk',
            institution: {
              group: 'Information & Computational Sciences',
              name: 'The James Hutton Institute'
            },
            img: './static/img/paul-shaw.jpg'
          },
          {
            name: 'Lesley Torrance',
            title: 'Director of Science',
            email: 'lesley.torrance@hutton.ac.uk',
            institution: {
              group: 'Cell & Molecular Sciences',
              name: 'The James Hutton Institute'
            },
            img: './static/img/lesley-torrance.jpg'
          }
        ],
        acknowledgements: [
          {
            logo: './static/img/acknowledgements/jhi.svg',
            name: 'The James Hutton Institute'
          },
          {
            logo: './static/img/acknowledgements/uosa.svg',
            name: 'University of St Andrews'
          },
          {
            logo: './static/img/acknowledgements/bbsrc.svg',
            name: 'Biotechnology and Biological Sciences Research Council'
          },
          {
            logo: './static/img/acknowledgements/ahdb.png',
            name: 'Agriculture & Horticulture Development Board'
          },
          {
            logo: './static/img/acknowledgements/scottish-government.svg',
            name: 'Rural and Environment Science and Analytical Services Devision of the Scottish Government'
          }
        ]
      }
    },
    methods: {
      open: function (url, newTab) {
        if (newTab) {
          window.open(url, '_blank')
        } else {
          window.location = url
        }
      }
    },
    mounted: function () {
      this.$jQuery('#banner').huttonBanner()
    }
  }
</script>

<style scoped>
  .acknowledgement > .logo {
    height: 250px;
    max-width: 75%;
    margin: auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: padding-box;
    background-attachment: scroll;
    box-sizing: border-box;
  }
  .acknowledgement .mdl-card__title-text {
    width: 100%;
    text-align: center;
    display: block;
  }
  .header-container {
    margin-left: 15px;
    margin-right: 15px;
  }
  .mdl-card__media {
    height: 300px;
    background-position: top;
  }
  .mdl-card__title {
    position: relative;
    overflow: visible;
  }
  .mdl-button--fab {
    position: absolute;
    right: 15px;
    top: -28px;
  }
</style>
