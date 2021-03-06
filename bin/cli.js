#! /usr/bin/env node
const { labelsVerify } = require("../lib/main.js")
const { Logger } = require("./logger.js")
const { args } = require("./args.js")

const LABELS_PATH = args['labels-path']
const BASE_DIR_PATH = args['base-dir-path']
const MAX_NUMBER_LABELS_ALLOWED = args['max-labels']
const CHECK_MAX_ALLOWED = MAX_NUMBER_LABELS_ALLOWED > -1
const HIDE_FOUND_LABELS = args['hide-found-labels']
const IGNORE_LABELS = args['ignore-labels']

Logger.start()

const labels = labelsVerify(LABELS_PATH, BASE_DIR_PATH, IGNORE_LABELS)
const unusedLabels = labels.filter(({ uses }) => uses === 0)
const foundNumber = unusedLabels.length
const exceededMaxAllowed = foundNumber > MAX_NUMBER_LABELS_ALLOWED

if (!HIDE_FOUND_LABELS) {
  Logger.unusedLabels(unusedLabels)
}

Logger.numberUnusedLabels(foundNumber)

if (CHECK_MAX_ALLOWED) {
  Logger.maxAllowed(MAX_NUMBER_LABELS_ALLOWED)

  if (exceededMaxAllowed) {
    Logger.info()
  }
}

Logger.end(!CHECK_MAX_ALLOWED || !exceededMaxAllowed)

if (exceededMaxAllowed && CHECK_MAX_ALLOWED) {
  process.exit(1)
}

process.exit()
