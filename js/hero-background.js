/* ============================================
   HERO SHADER BACKGROUND — Grain Gradient
   Adaptação vanilla do componente React
   <GrainGradient /> (@paper-design/shaders),
   com as cores do projeto vindas do :root.
   Sem CDN/WebGL o hero mantém o fundo em CSS.
   ============================================ */

(function () {
    'use strict';

    var mount = document.getElementById('hero-shader');
    if (!mount) return;

    import('https://esm.sh/@paper-design/shaders@0.0.76')
        .then(function (shaders) {
            /* ShaderMount exige a textura de ruído já carregada */
            var noiseTexture = shaders.getShaderNoiseTexture();
            return noiseTexture.decode().then(function () {
                return { shaders: shaders, noiseTexture: noiseTexture };
            });
        })
        .then(function (deps) {
            var shaders = deps.shaders;
            var rootStyles = getComputedStyle(document.documentElement);
            var cssVar = function (name) {
                return rootStyles.getPropertyValue(name).trim();
            };

            var colors = [cssVar('--accent'), cssVar('--accent2'), cssVar('--border2')];
            var sizing = Object.assign({}, shaders.defaultObjectSizing, {
                scale: 1, rotation: 0, offsetX: 0, offsetY: 0
            });

            var uniforms = {
                u_colorBack: shaders.getShaderColorFromString(cssVar('--bg')),
                u_colors: colors.map(shaders.getShaderColorFromString),
                u_colorsCount: colors.length,
                u_softness: 0.76,
                u_intensity: 0.45,
                u_noise: 0,
                u_shape: shaders.GrainGradientShapes.corners,
                u_noiseTexture: deps.noiseTexture,
                u_fit: shaders.ShaderFitOptions[sizing.fit],
                u_scale: sizing.scale,
                u_rotation: sizing.rotation,
                u_offsetX: sizing.offsetX,
                u_offsetY: sizing.offsetY,
                u_originX: sizing.originX,
                u_originY: sizing.originY,
                u_worldWidth: sizing.worldWidth,
                u_worldHeight: sizing.worldHeight
            };

            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            var shader = new shaders.ShaderMount(
                mount,
                shaders.grainGradientFragmentShader,
                uniforms,
                undefined,
                reduceMotion.matches ? 0 : 1
            );

            reduceMotion.addEventListener('change', function (e) {
                shader.setSpeed(e.matches ? 0 : 1);
            });
        })
        .catch(function () {
            /* Offline ou sem WebGL: fica o fundo estático em CSS. */
        });
})();
