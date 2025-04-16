import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Header2 } from "../app/components/Header2/Header2";

const meta = {
  title: "Example/Header2",
  component: Header2,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
} satisfies Meta<typeof Header2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: "Jane Doe..",
    },
  },
};

export const LoggedOut: Story = {};
