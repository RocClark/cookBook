import React from "react";
import type { Meta, StoryObj, StoryContext } from "@storybook/react";
import AuthHeader from "../app/components/AuthHeader/AuthHeader";
import { AuthContext } from "../app/context/AuthContext";

const meta = {
  title: "Components/AuthHeader",
  component: AuthHeader,
  parameters: {
    layout: "fullwidth",
  },
  argTypes: {
    onLogout: {
      action: "logout clicked",
      description: "Called when the logout button is clicked",
    },
  },
  decorators: [
    (Story, context: StoryContext) => {
      const mockAuthValue = {
        isLoggedIn: Boolean(context.args.isLoggedIn),
        logout: async () => {
          // @ts-ignore - Storybook will provide this action
          context.args.onLogout?.();
          console.log("Mock logout called");
        },
        checkAuthStatus: () => {
          console.log("Mock checkAuthStatus called");
        },
      };

      return (
        <AuthContext.Provider value={mockAuthValue}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof AuthHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the header with a logout button when the user is logged in",
      },
    },
  },
};
