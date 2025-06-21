import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormActionPlan } from "../components/forms/FormActionPlan";
import '@testing-library/jest-dom';


// Mock the auth function
jest.mock("@clerk/nextjs/server", () => ({
    auth: jest.fn().mockResolvedValue({ userId: "test-user", redirectToSignIn: jest.fn() }),
}));

// Mock server actions
jest.mock("../lib/actions", () => ({
    createActionPlan: "/api/create",
    updateActionPlan: "/api/update",
}));

// Mock FormFieldsTimePlanning
// jest.mock("../components/forms/FormFieldsTimePlanning", () => ({
//     __esModule: true,
//     default: () => React.createElement('div', { 'data-testid': 'form-fields-time-planning' })
// }));

describe("FormActionPlan", () => {
    it("renders create form with empty fields", () => {
        // Render with empty props (create mode)
        render(
            <FormActionPlan />
        );

        const titleInput = screen.getByPlaceholderText("Action Title");
        expect(titleInput).toHaveValue("");
        expect(screen.getByRole("button")).toHaveTextContent("Save");
    });
    
    it("renders update form with values", () => {
        const props = {
            id: 1,
            title: "Swimming",
        }

        render(
            <FormActionPlan {...props} />
        );

        const titleInput = screen.getByPlaceholderText("Action Title");

        expect(titleInput).toHaveValue("Swimming");
        expect(screen.getByRole("button")).toHaveTextContent("Update");
    })

    // it("renders update form with values", async () => {
    //     const props = {
    //         id: 1,
    //         userId: "test-user",
    //         title: "Test Title",
    //         content: "Test Content",
    //         dtstart: "2024-01-01",
    //         until: "2024-12-31",
    //         rrule: "FREQ=DAILY",
    //         timezone: "UTC",
    //         remind: "one_hour_before",
    //     };

    //     render(
    //         <FormActionPlan {...props} />
    //     );

    //     const titleInput = await screen.findByPlaceholderText("title");
    //     const contentInput = await screen.findByPlaceholderText("content");

    //     expect(titleInput).toHaveValue("Test Title");
    //     expect(contentInput).toHaveValue("Test Content");
    //     expect(screen.getByRole("button")).toHaveTextContent("Update");
    // });
});