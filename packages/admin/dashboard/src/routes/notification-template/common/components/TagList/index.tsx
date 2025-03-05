import { Badge } from "@medusajs/ui"
import { useReducer } from "react"
import { ChevronDown, ChevronRight } from "@medusajs/icons"

const TagList = ({ tags, onClick }) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-lg bg-white p-4 shadow-md">
      <NestedTags data={tags} onClick={onClick} />
    </div>
  )
}

const expandedReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.key]: !state[action.key] }
    default:
      return state
  }
}

const NestedTags = ({ data, parentKey = "", onClick }) => {
  const [expandedKeys, dispatch] = useReducer(expandedReducer, {})

  const toggleExpand = (key) => {
    dispatch({ type: "TOGGLE", key })
  }

  return (
    <div className="flex flex-col gap-1 border-l border-gray-300 pl-2">
      {Object.entries(data).map(([key, value]) => {
        const isObject = typeof value === "object" && value !== null
        const isArray = Array.isArray(value)
        const fullKey = parentKey ? `${parentKey}.${key}` : key
        const isExpanded = expandedKeys[fullKey]

        return (
          <div key={fullKey} className="ml-2 flex flex-col">
            <Badge
              onClick={() => {
                if (isObject) {
                  toggleExpand(fullKey)
                }
                if (!isObject && onClick) {
                  onClick(fullKey)
                }
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all 
                ${isExpanded ? "bg-gray-100" : "hover:bg-gray-200"}
                ${
                  isArray
                    ? "bg-green-200 text-green-700"
                    : isObject
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-200 text-gray-700"
                }
              `}
            >
              {isObject ? (
                <div className="focus:outline-none">
                  {isExpanded ? (
                    <ChevronDown className="text-gray-600" size={16} />
                  ) : (
                    <ChevronRight className="text-gray-600" size={16} />
                  )}
                </div>
              ) : (
                <div className=""></div>
              )}

              {isArray ? `[${key}]` : `{{${key}}}`}
            </Badge>

            {isExpanded && isObject && (
              <div className="ml-4 mt-1">
                {isArray ? (
                  value.map((item, index) => (
                    <div key={`${fullKey}.${index}`}>
                      {/* Show array index as selectable badge */}
                      <div
                        className="flex cursor-pointer items-center gap-2 rounded-lg  bg-yellow-200 p-1 text-yellow-700"
                        onClick={() => toggleExpand(`${fullKey}.${index}`)}
                      >
                        <button className="focus:outline-none">
                          {expandedKeys[`${fullKey}.${index}`] ? (
                            <ChevronDown className="text-gray-600" />
                          ) : (
                            <ChevronRight className="text-gray-600" />
                          )}
                        </button>
                        <p className="">[{index}]</p>
                      </div>

                      {/* Expand specific array index */}
                      {expandedKeys[`${fullKey}.${index}`] && (
                        <div className="ml-4 mt-1">
                          <NestedTags
                            data={item}
                            parentKey={`${fullKey}.${index}`}
                            onClick={onClick}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <NestedTags
                    data={value}
                    parentKey={fullKey}
                    onClick={onClick}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TagList
