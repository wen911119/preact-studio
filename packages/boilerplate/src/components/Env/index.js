import { h, Component } from "preact";

const env = {
  containerWidth: document.body.clientWidth
};

export const WithEnv = BaseComponent => ({ ...props }) => (
  <BaseComponent {...props} $env={env} />
);

