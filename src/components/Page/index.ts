import { withInstall } from '/@/utils';

import pageFooter from './src/PageFooter.vue';
import pageWrapper from './src/PageWrapper.vue';
import pageCard from './src/PageCard.vue';

export const PageFooter = withInstall(pageFooter);
export const PageWrapper = withInstall(pageWrapper);
export const PageCard = withInstall(pageCard);

export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
