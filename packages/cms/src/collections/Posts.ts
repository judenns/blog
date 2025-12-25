import {
    convertLexicalToHTML,
    type HTMLConvertersFunction,
} from "@payloadcms/richtext-lexical/html";
import type { CollectionConfig } from "payload";

const CMS_URL = process.env.CMS_URL || "http://localhost:3000";

const htmlConverters: HTMLConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: ({ node }) => {
        const url = (node as any).value?.url || "";
        const alt = (node as any).value?.alt || "";
        const fullUrl = url.startsWith("http") ? url : `${CMS_URL}${url}`;
        return `<img src="${fullUrl}" alt="${alt}" />`;
    },
});

export const Posts: CollectionConfig = {
    slug: "posts",
    admin: {
        useAsTitle: "title",
    },
    access: {
        read: () => true,
    },
    hooks: {
        afterRead: [
            ({ doc }) => {
                if (doc.content) {
                    doc.contentHTML = convertLexicalToHTML({
                        data: doc.content,
                        converters: htmlConverters,
                    });
                }
                return doc;
            },
        ],
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
        },
        {
            name: "description",
            type: "textarea",
        },
        {
            name: "content",
            type: "richText",
        },
        {
            name: "publishedAt",
            type: "date",
        },
    ],
};
