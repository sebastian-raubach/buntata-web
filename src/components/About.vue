<template>
  <div>
    <mdc-layout-grid>
      <mdc-layout-cell desktop=12 tablet=8>
        <mdc-text typo='headline3'>{{ $t('aboutHeading') }}</mdc-text>
        <mdc-text>{{ $t('aboutTextOne' ) }}</mdc-text>
        <mdc-text>{{ $t('aboutTextTwo') }}</mdc-text>
        <mdc-text>{{ $t('aboutTextThree') }}</mdc-text>
        <mdc-button raised @click="openUrl('https://play.google.com/store/apps/details?id=uk.ac.hutton.ics.buntata', true)"><mdi-google-play-icon class="icon"/>{{ $t('linkTextGooglePlay') }}</mdc-button>
        <mdc-button raised @click="openUrl('https://github.com/buntata/buntata-web', true)"><mdi-github-circle-icon class="icon"/>{{ $t('linkTextGitHub') }}</mdc-button>
        <mdc-button raised @click="openUrl('https://ics.hutton.ac.uk/get-buntata', true)"><mdi-earth-icon class="icon"/>{{ $t('linkTextWebsite') }}</mdc-button>
        <mdc-button raised @click="openUrl('mailto:cropgeeksapps@hutton.ac.uk')"><mdi-email-icon class="icon"/>{{ $t('linkTextEmail') }}</mdc-button>
        <mdc-button raised @click="openUrl('https://twitter.com/BuntataApp', true)"><mdi-twitter-icon class="icon"/>{{ $t('linkTextTwitter') }}</mdc-button>
        <mdc-text typo='headline4'>Team</mdc-text>
      </mdc-layout-cell>
      <mdc-layout-cell desktop=3 v-for="dev in devs" :key="dev.name">
        <mdc-card>
          <mdc-card-media :style="{ backgroundImage: 'url(\'' + dev.img + '\')' }"></mdc-card-media>
          <div class="mdc-card-fab">
            <mdc-fab @click="openUrl('mailto:' + dev.email)">
              <mdi-email-icon class="icon"/>
            </mdc-fab>
          </div>
          <mdc-card-header :title="dev.name" />
          <mdc-card-text v-if="dev.title">{{ dev.title }}</mdc-card-text>
          <mdc-card-text v-if="dev.institution && dev.institution.group">{{ dev.institution.group }}</mdc-card-text>
          <mdc-card-text v-if="dev.institution && dev.institution.name">{{ dev.institution.name }}</mdc-card-text>
        </mdc-card>
      </mdc-layout-cell>
      <mdc-layout-cell desktop=12 tablet=8>
        <mdc-text typo='body1'>{{ $t('aboutThanksTo') }}</mdc-text>
      </mdc-layout-cell>
      <mdc-layout-cell desktop=12 tablet=8>
        <mdc-text typo='headline4'>{{ $t('aboutAcknowledgements') }}</mdc-text>
      </mdc-layout-cell>
      <mdc-layout-cell desktop=3 v-for="ack in acknowledgements" :key="ack.name" class="acknowledgement">
        <div class="logo" :style="{ backgroundImage: 'url(\'' + ack.logo + '\')' }"></div>
        <mdc-headline class="title">{{ ack.name }}</mdc-headline>
      </mdc-layout-cell>
      
    </mdc-layout-grid>
    <div id='banner' />
  </div>
</template>

<script>
  require('mdi-vue/GooglePlayIcon')
  require('mdi-vue/EarthIcon')
  require('mdi-vue/EmailIcon')
  require('mdi-vue/TwitterIcon')
  require('mdi-vue/GithubCircleIcon')

  require('../assets/js/hutton-banner.js')
  require('../assets/css/hutton-banner.css')

  export default {
    data: function () {
      return {
        // The developers
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
        // Acknowledgements for funders
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
    mounted: function () {
      // Add the Hutton banner
      this.$jQuery('#banner').huttonBanner()
    }
  }
</script>

<style scoped>
  .icon {
    fill: white;
    padding-right: 4px;
  }

  .mdc-card__media {
    height: 300px;
    background-position: top;
  }
  .mdc-card-fab {
    position: relative;
    overflow: visible;
  }
  .mdc-fab {
    position: absolute;
    right: 15px;
    top: -28px;
  }
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
  .acknowledgement > .title {
    width: 100%;
    text-align: center;
    display: block;
  }
</style>
