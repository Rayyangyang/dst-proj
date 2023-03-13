import type { App } from 'vue';
import { Button } from './Button';
import { PageCard } from './Page';
import { Input, Layout, Form, Select, Image } from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app.use(Input).use(Button).use(Form).use(Select).use(Image).use(PageCard).use(Layout);
}
