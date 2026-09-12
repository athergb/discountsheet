"use client";

import { useEffect } from "react";

export default function ManagerArrangementButton() {
  useEffect(() => {
    const syncButton = () => {
      const container = document.querySelector(".admin-actions");
      if (!container) return;

      const managerMode = Array.from(container.children).some((element) =>
        element.textContent?.includes("Manager Mode")
      );

      const existingButton = container.querySelector(
        "[data-arrange-offers]"
      );

      if (!managerMode) {
        existingButton?.remove();
        return;
      }

      if (existingButton) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "admin-button";
      button.setAttribute("data-arrange-offers", "true");
      button.textContent = "↕ Arrange Offers";
      button.addEventListener("click", () => {
        window.location.href = "/manager-arrangement";
      });

      const addOfferButton = Array.from(container.querySelectorAll("button")).find(
        (item) => item.textContent?.includes("Add Offer")
      );

      if (addOfferButton) {
        container.insertBefore(button, addOfferButton);
      } else {
        container.appendChild(button);
      }
    };

    syncButton();

    const observer = new MutationObserver(syncButton);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
