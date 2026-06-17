import { beforeAll } from './properties-order-groups/before-all.js';
import { positioning } from './properties-order-groups/positioning.js';
import { layout } from './properties-order-groups/layout.js';
import { sizing } from './properties-order-groups/sizing.js';
import { appearance } from './properties-order-groups/appearance.js';
import { typography } from './properties-order-groups/typography.js';
import { transform } from './properties-order-groups/transform.js';
import { transition } from './properties-order-groups/transition.js';
import { interaction } from './properties-order-groups/interaction.js';

const propertyGroups = [
    ['composes'],
    ['all'],
    beforeAll,
    positioning,
    layout,
    sizing,
    appearance,
    typography,
    transform,
    transition,
    interaction
];

const propertiesOrder = propertyGroups.map((properties) => ({
    noEmptyLineBetween: true,
    emptyLineBefore: 'threshold',
    properties
}));

export default {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-css-modules'],
    plugins: ['stylelint-order', 'stylelint-use-logical'],
    rules: {
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-blockless', 'first-nested'],
                ignore: ['after-comment', 'blockless-after-same-name-blockless', 'first-nested'],
                ignoreAtRules: ['else']
            }
        ],
        'declaration-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment', 'after-declaration']
            }
        ],
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates-with-different-values']
            }
        ],
        'property-disallowed-list': [
            [/^(padding|margin)-(top|right|bottom|left)$/],
            {
                message: "Do not use physical 'padding/margin' CSS properties, use logical properties instead."
            }
        ],
        'selector-class-pattern': null,
        'no-descending-specificity': null,
        'scss/at-mixin-argumentless-call-parentheses': 'always',
        'scss/no-global-function-names': null,
        'csstools/use-logical': 'always',
        'order/order': [
            [
                { type: 'at-rule', name: 'forward' },
                { type: 'at-rule', name: 'use' },
                'dollar-variables',
                'custom-properties',
                { type: 'at-rule', name: 'custom-media' },
                { type: 'at-rule', name: 'function' },
                { type: 'at-rule', name: 'mixin' },
                { type: 'at-rule', name: 'extend' },
                { type: 'at-rule', name: 'include' },
                'declarations',
                {
                    name: 'pseudo-element',
                    type: 'rule',
                    selector: /^&::[\w-]+/,
                    hasBlock: true
                },
                'rules',
                {
                    name: 'pseudo-class',
                    type: 'rule',
                    selector: /^&:[\w-]+/,
                    hasBlock: true
                },
                {
                    name: 'modifier',
                    type: 'rule',
                    selector: /^&_[\w-]+/,
                    hasBlock: true
                },
                { type: 'at-rule', name: 'media', hasBlock: true }
            ]
        ],
        'order/properties-order': [
            propertiesOrder,
            {
                unspecified: 'bottomAlphabetical',
                emptyLineBeforeUnspecified: 'always',
                emptyLineMinimumPropertyThreshold: 5
            }
        ],
        'selector-class-pattern': [
            '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
            {
                resolveNestedSelectors: true,
                message: 'Expected class selector to be kebab-case'
            }
        ]
    }
};