import {
  AdminOrder,
  AdminOrderLineItem,
  AdminOrderPreview,
} from "@medusajs/framework/types";
import { Badge, Text } from "@medusajs/ui";
import { useMemo } from "react";
import { Amount } from "./amount";
import { Link } from "react-router-dom";

export const QuoteItem = ({
  item,
  originalItem,
  currencyCode,
}: {
  item: AdminOrderPreview["items"][0];
  originalItem?: AdminOrderLineItem;
  currencyCode: string;
}) => {

  const isItemUpdated = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_UPDATE"),
    [item]
  );

  return (
    <div
      key={item.id}
      className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4 text-left"
    >
      <div className="flex items-start gap-x-4">
        <div>
          <Link
            to={`/products/${item.product_id}`}
            className="text-blue-400 hover:underline"
          >
            {item.product_title} - {item.title}
          </Link>

          {item.variant_sku && (
            <div className="flex items-center gap-x-1">
              <Text size="small">{item.variant_sku}</Text>
            </div>
          )}
          <Text size="small">
            {item.variant?.options?.map((o) => o.value).join(" · ")}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-x-4">
        <div className="flex items-center justify-end gap-x-4">
          <Amount
            className="text-sm text-right justify-end items-end"
            currencyCode={currencyCode}
            // @ts-ignore
            amount={item.detail.unit_price}
            originalAmount={item.unit_price}
          />
        </div>

        <div className="flex items-center gap-x-2">
          <div className="w-fit min-w-[27px]">
            <Badge size="xsmall" color="grey">
              <span className="tabular-nums text-xs">{item.quantity}</span>x
            </Badge>
          </div>

          <div>

            {isItemUpdated && (
              <Badge
                size="2xsmall"
                rounded="full"
                color="orange"
                className="mr-1"
              >
                Modified
              </Badge>
            )}
          </div>

          <div className="overflow-visible"></div>
        </div>

        <Amount
          className="text-sm text-right justify-end items-end"
          currencyCode={currencyCode}
          amount={item.unit_price}
          originalAmount={originalItem?.unit_price}
        />
      </div>
    </div>
  );
};

export const QuoteItems = ({
  order,
}: {
  order: AdminOrder;
}) => {
  const itemsMap = useMemo(() => {
    return new Map(order.items.map((item) => [item.id, item]));
  }, [order]);

  return (
    <div>
      {order.items?.map((item) => {
        return (
          <QuoteItem
            key={item.id}
            item={item}
            originalItem={itemsMap.get(item.id)}
            currencyCode={order.currency_code}
          />
        );
      })}
    </div>
  );
};