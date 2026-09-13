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

      if (!managerMode) {
        container.querySelector("[data-arrange-offers]")?.remove();
        return;
      }

      // Keep the manager controls evenly spaced and visually separated.
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.gap = "8px";
      container.style.flexWrap = "nowrap";

      const managerStatus = Array.from(container.children).find((element) =>
        element.textContent?.includes("Manager Mode")
      );
      if (managerStatus) {
        managerStatus.style.whiteSpace = "nowrap";
        managerStatus.style.marginRight = "4px";
      }

      const styleActionButton = (button, background, border, width) => {
        if (!button) return;
        button.style.boxSizing = "border-box";
        button.style.height = "44px";
        button.style.minHeight = "44px";
        button.style.width = width;
        button.style.minWidth = width;
        button.style.padding = "0 18px";
        button.style.margin = "0";
        button.style.borderRadius = "10px";
        button.style.border = `1px solid ${border}`;
        button.style.background = background;
        button.style.color = "#ffffff";
        button.style.fontSize = "15px";
        button.style.fontWeight = "700";
        button.style.lineHeight = "1";
        button.style.whiteSpace = "nowrap";
        button.style.display = "inline-flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.gap = "6px";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      };

      const addOfferButton = Array.from(container.querySelectorAll("button")).find(
        (item) => item.textContent?.includes("Add Offer")
      );
      const logoutButton = Array.from(container.querySelectorAll("button")).find(
        (item) => item.textContent?.trim() === "Logout"
      );

      const existingButton = container.querySelector("[data-arrange-offers]");
      const button = existingButton || document.createElement("button");

      if (!existingButton) {
        button.type = "button";
        button.setAttribute("data-arrange-offers", "true");
        button.textContent = "↕ Arrange Offers";
        button.addEventListener("click", () => {
          window.location.href = "/manager-arrangement";
        });

        if (addOfferButton) {
          container.insertBefore(button, addOfferButton);
        } else {
          container.appendChild(button);
        }
      }

      styleActionButton(button, "#0aa6c0", "#0795ad", "160px");
      styleActionButton(addOfferButton, "#0aa6c0", "#0795ad", "140px");
      styleActionButton(logoutButton, "#e63950", "#d92f45", "104px");
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
