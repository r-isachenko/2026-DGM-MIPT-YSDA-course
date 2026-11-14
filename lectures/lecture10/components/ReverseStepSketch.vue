<script setup>
defineProps({ stochastic: Boolean })
</script>

<template>
  <svg viewBox="0 0 485 145" style="display:block;width:100%;height:146px" role="img"
    :aria-label="stochastic ? 'At time one, the observed position is one. One step earlier the positions are spread around a mean below one.' : 'One arrow traces the ODE flow back to a single earlier state.'">
    <g stroke="#cbd8de" stroke-width="1.4" stroke-dasharray="3 5">
      <path d="M105 7V113 M406 7V113"/>
      <path v-if="stochastic" d="M105 41H406" />
    </g>
    <g v-if="stochastic">
      <path d="M105 11 C104 30 101 44 81 55 C57 66 57 74 81 85 C101 96 104 110 105 130 Z"
        fill="#e4d8f2" transform="translate(0 -3)"/>
      <path d="M398 42L109 29 M398 43L109 105" stroke="#baa0d5" stroke-width="1.7" fill="none"/>
      <path d="m107 29 9 -3 -1 7z M107 105l8 -6 1 7z" fill="#baa0d5"/>
      <path d="M398 42L110 67" stroke="#8050b2" stroke-width="2.7"/>
      <path d="m107 67 11 -5 -1 8z" fill="#8050b2"/>
      <circle cx="105" cy="67" r="4.7" fill="#8050b2"/>
    </g>
    <g v-else>
      <path d="M397 42 Q260 43 110 79" stroke="#007f82" stroke-width="2.8" fill="none"/>
      <path d="m107 80 9 -6 2 8z" fill="#007f82"/>
      <circle cx="105" cy="80" r="4.7" fill="#007f82"/>
    </g>
    <circle cx="406" cy="41" r="5.7" fill="#17324d"/>
    <g style="font: italic 22px Georgia, serif" fill="#17324d">
      <text x="419" y="47">{{ stochastic ? '1' : 'y' }}</text>
      <text :x="stochastic ? 52 : 91" :y="stochastic ? 73 : 86" text-anchor="end">{{ stochastic ? '1 − h' : 'x' }}</text>
    </g>
    <g style="font: italic 18px Georgia, serif" text-anchor="middle" fill="#587083">
      <text x="105" y="142">{{ stochastic ? '1 − h' : 't − h' }}</text>
      <text x="406" y="142">{{ stochastic ? '1' : 't' }}</text>
    </g>
  </svg>
</template>
